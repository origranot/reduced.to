import { Injectable, LoggerService } from '@nestjs/common';
import { ConsoleTransport, Logger } from '@origranot/ts-logger';
import { AppConfigService } from '@reduced.to/config';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly config: AppConfigService) {
    this.logger = new Logger({
      transports: [
        new ConsoleTransport({
          threshold: this.config.getConfig().logger.console.threshold,
        }),
      ],
    });
  }

  log = (message: any, ...optionalParams: any[]) => this.logger.info(message, ...optionalParams);
  error = (message: any, ...optionalParams: any[]) => this.logger.error(message, ...optionalParams);
  warn = (message: any, ...optionalParams: any[]) => this.logger.warn(message, ...optionalParams);
  debug = (message: any, ...optionalParams: any[]) => this.logger.debug(message, ...optionalParams);
}
