import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConsoleTransport, Logger } from '@origranot/ts-logger';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class AppLoggerSerivce implements LoggerService {
  constructor(private readonly config: AppConfigService) {
    if (!this.logger) {
      this.logger = new Logger({
        transports: [
          new ConsoleTransport({
            threshold: this.config.getConfig().logger.console.threshold,
          }),
        ],
      });
    }
  }

  private readonly logger: Logger;

  log = (message: any, ...optionalParams: any[]) => this.logger.info(message, ...optionalParams);
  error = (message: any, ...optionalParams: any[]) => this.logger.error(message, ...optionalParams);
  warn = (message: any, ...optionalParams: any[]) => this.logger.warn(message, ...optionalParams);
  debug = (message: any, ...optionalParams: any[]) => this.logger.debug(message, ...optionalParams);
}
