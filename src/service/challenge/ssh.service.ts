import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'ssh2';
import { BadRequestException } from '../../exceptions/bad-request.exception';
import { Logger } from 'winston';
import { UnauthorizedException } from '../../exception/unauthorized.exception';
import { ErrorEnum } from '../../enum/error.enum';

@Injectable()
export class SshService {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  public async testConnection(host: string, username: string): Promise<void> {
    let success = false;
    this.logger.info(
      'Check SSH connection, host=%s, username=%s',
      host,
      username,
    );

    const conn = new Client();
    await new Promise<void>((resolve, reject): void => {
      conn.connect({
        host: host,
        port: 22,
        username: username,
        privateKey: Buffer.from(process.env.SSH_PRIVATE_KEY_BASE_64, 'base64'),
      });
      conn.on('error', () => {
        reject();
      });
      conn.on('ready', () => {
        this.logger.info(
          'Successfully connect via SSH, host=%s, username=%s',
          host,
          username,
        );
        success = true;
        resolve();
      });
    }).catch(() => {
      this.logger.warn(
        'Error when trying to connect via SSH, host=%s, username=%s',
        host,
        username,
      );
    });

    if (!success) {
      throw new UnauthorizedException(ErrorEnum.SSH_CONNECTION_FAILS);
    }
    conn.end();
  }
}
/*
.on('ready', () => {
        console.log('Connected');
        conn.exec('ls', (err, stream) => {
          if (err) {
            console.error('err');
          }
          stream
            .on('data', (data) => {
              console.log(data.toString());
            })
            .stderr.on('data', (data) => {
              console.log('STDERR: ' + data);
            })
            .on('close', (code, signal) => {
              console.log(
                'Stream :: close :: code: ' + code + ', signal: ' + signal,
              );
              conn.end();
            });
        });
      });
*/
