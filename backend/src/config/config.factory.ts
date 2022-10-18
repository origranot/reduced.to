import { ConfigFactory } from '@nestjs/config';

export const configFactory: ConfigFactory<{ config: IConfiguration }> = () => {
  return {
    config: {
      app: {
        port: +process.env.APP_PORT || 3000,
      },
    },
  };
};

export interface AppConfig {
  port: number;
}

export interface IConfiguration {
  app: AppConfig;
}
