import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from './config.module';
import { AppConfigService, ConfigNotFoundError } from './config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [AppConfigService],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct configuration object', () => {
    const expectedConfig = {
      key1: 'value1',
      key2: 'value2',
    };
    jest.spyOn(service['configService'], 'get').mockReturnValue(expectedConfig);
    expect(service.getConfig()).toEqual(expectedConfig);
  });

  it('should throw a ConfigNotFoundError if config is not found', () => {
    jest.spyOn(service['configService'], 'get').mockReturnValue(undefined);
    expect(() => service.getConfig()).toThrow(ConfigNotFoundError);
  });
});
