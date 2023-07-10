import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientChannel, ConnectConfig } from 'ssh2';
import { Logger } from 'winston';
import { UnauthorizedException } from '../../exception/unauthorized.exception';
import { ChallengeEntity } from '../../entity/challenge.entity';
import { TextUtil } from '../../util/text-util';
import { BadRequestException } from '../../exception/bad-request.exception';

@Injectable()
export class SshService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  public async testConnection(host: string, username: string): Promise<void> {
    this.logger.info(
      `Check SSH connection, host=${host}, username=${username}`,
    );

    const conn: Client = new Client();
    await new Promise<void>(
      (
        resolve: (value: PromiseLike<void> | void) => void,
        reject: (reason?: any) => void,
      ): void => {
        conn.connect(this.getConnectionParams(host, username));
        conn.on('error', (error: Error): void => {
          reject(error);
        });
        conn.on('ready', (): void => {
          this.logger.info(
            `Successfully connected through SSH, host=${host}, username=${username}`,
          );
          resolve();
        });
      },
    ).catch((err: Error): void => {
      this.logger.warn(
        `Error when trying to connect through SSH, host=${host}, username=${username}`,
      );
      throw new UnauthorizedException(err.message);
    });
    conn.end();
  }

  public async runChallenge(
    host: string,
    username: string,
    challenge: ChallengeEntity,
  ): Promise<void> {
    const sshCommand: string = challenge.ssh_command_verify;

    this.logger.info(
      `Run challenge through SSH, host=${host}, username=${username}, command=${sshCommand}`,
    );

    const conn: Client = new Client();
    await new Promise<void>((resolve, reject): void => {
      conn.connect(this.getConnectionParams(host, username));

      conn.on('error', (error: Error): void => {
        reject(error);
      });

      conn.on('ready', (): void => {
        this.executeSshCommandWhenReady(
          conn,
          sshCommand,
          resolve,
          reject,
          challenge,
        );
      });
    }).catch((err: Error): void => {
      this.logger.warn(
        `Error when trying to execute challenge through SSH, host=${host}, username=${username}`,
      );
      throw new BadRequestException(err.message);
    });
    conn.end();
  }

  private executeSshCommandWhenReady(
    conn: Client,
    sshCommand: string,
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
    challenge: ChallengeEntity,
  ): void {
    conn.exec(sshCommand, (err: Error, stream: ClientChannel): void => {
      if (err) {
        reject(err);
      }
      let sshResult: string;
      let sshError: string;
      stream
        .on('data', (data: any): void => {
          sshResult = TextUtil.escapeLineBreaks(data.toString());
        })
        .on('close', (): void => {
          (async (): Promise<void> => {
            await this.closeEventListener(
              conn,
              sshError,
              sshResult,
              challenge,
              resolve,
              reject,
            );
          })();
        })
        .on('error', (data: any): void => {
          reject(new Error(data));
        })
        .stderr.on('data', (data: any): void => {
          if (sshError) {
            sshError += data.toString();
          } else {
            sshError = data.toString();
          }
        });
    });
  }

  private async closeEventListener(
    conn: Client,
    sshError: string,
    sshResult: string,
    challenge: ChallengeEntity,
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
  ): Promise<void> {
    if (sshError) {
      reject(new Error(TextUtil.escapeLineBreaks(sshError)));
    }

    // if result is dynamic, will execute desired result in through SSH
    if (challenge.ssh_command_expected_result_dynamic) {
      challenge.ssh_command_expected_result = await this.getDynamicSSHResult(
        conn,
        challenge.ssh_command_expected_result,
      );
    }

    if (sshResult === challenge.ssh_command_expected_result) {
      resolve();
    } else {
      const errorMessage: string = sshResult
        ? `<code>${sshResult}</code> n'est pas le résultat attendu`
        : 'Le résultat est vide';
      reject(new Error(errorMessage));
    }
  }

  private async getDynamicSSHResult(
    conn: Client,
    sshCommand: string,
  ): Promise<string> {
    let sshResult: string;
    this.logger.info(`Get dynamic result through SSH, command=${sshCommand}`);

    return await new Promise<string>((resolve): void => {
      conn.exec(sshCommand, (err: Error, stream: ClientChannel): void => {
        if (err) {
          throw err;
        }
        stream
          .on('data', (data: any): void => {
            sshResult = TextUtil.escapeLineBreaks(data.toString());
          })
          .on('close', (): void => {
            resolve(sshResult);
          });
      });
    });
  }

  private getConnectionParams(host: string, username: string): ConnectConfig {
    return {
      host: host,
      port: 22,
      username: username,
      privateKey: Buffer.from(process.env.SSH_PRIVATE_KEY_BASE_64, 'base64'),
    };
  }
}
