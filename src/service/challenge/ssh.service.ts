import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientChannel, ConnectConfig } from 'ssh2';
import { Logger } from 'winston';
import { UnauthorizedException } from '../../exception/unauthorized.exception';
import { ChallengeEntity } from '../../entity/challenge.entity';
import { ErrorEnum } from '../../enum/error.enum';
import { TextUtil } from '../../util/text-util';
import { BadRequestException } from '../../exception/bad-request.exception';

@Injectable()
export class SshService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  public async testConnection(host: string, username: string): Promise<void> {
    this.logger.info(
      'Check SSH connection, host=%s, username=%s',
      host,
      username,
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
            'Successfully connected through SSH, host=%s, username=%s',
            host,
            username,
          );
          resolve();
        });
      },
    ).catch((err: Error): void => {
      this.logger.warn(
        'Error when trying to connect through SSH, host=%s, username=%s',
        host,
        username,
      );
      throw new UnauthorizedException(err.message);
    });
    conn.end();
  }

  // FIXME: too much complexity
  public async runChallenge(
    host: string,
    username: string,
    challenge: ChallengeEntity,
  ): Promise<void> {
    this.logger.info(
      'Run challenge through SSH, host=%s, username=%s',
      host,
      username,
    );

    const sshCommand: string = challenge.ssh_command_verify,
      isDynamicShhResult = challenge.ssh_command_expected_result_dynamic;
    let sshCommandExpectedResult: string =
      challenge.ssh_command_expected_result;

    const conn: Client = new Client();
    await new Promise<void>((resolve, reject): void => {
      conn.connect(this.getConnectionParams(host, username));

      conn.on('error', (error: Error): void => {
        reject(error);
      });

      conn.on('ready', (): void => {
        conn.exec(sshCommand, (err: Error, stream: ClientChannel) => {
          if (err) {
            reject(err);
          }
          let sshResult: string;
          let sshError: string;
          stream
            .on('data', (data: any): void => {
              sshResult = TextUtil.escapeLineBreaks(data.toString());
            })
            .on('close', async (): Promise<void> => {
              if (sshError) {
                reject(new Error(TextUtil.escapeLineBreaks(sshError)));
              }

              // if result is dynamic, will execute result in host through SSH
              // (little problem is, user can see response)
              if (isDynamicShhResult) {
                sshCommandExpectedResult = await this.getDynamicSSHResult(
                  conn,
                  sshCommandExpectedResult,
                );
              }

              if (sshResult === sshCommandExpectedResult) {
                resolve();
              } else {
                const errorMessage: string = sshResult
                  ? `<code>${sshResult}</code> n'est pas le résultat attendu`
                  : 'Le résultat est vide';
                reject(new Error(errorMessage));
              }
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
      });
    }).catch((err: Error): void => {
      this.logger.warn(
        'Error when trying to execute challenge through SSH, host=%s, username=%s',
        host,
        username,
      );
      throw new BadRequestException(err.message);
    });
    conn.end();
  }

  private async getDynamicSSHResult(
    conn: Client,
    sshCommand: string,
  ): Promise<string> {
    let sshResult: string;

    return await new Promise<string>((resolve) => {
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
