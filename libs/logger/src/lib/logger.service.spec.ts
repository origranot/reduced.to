import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@reduced.to/config';
import { AppLoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: AppLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [AppLoggerService],
    }).compile();

    service = module.get<AppLoggerService>(AppLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to log', () => {
    const spy = jest.spyOn(service, 'log');

    service.log('test');

    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should be able to log with context', () => {
    const spy = jest.spyOn(service, 'log');

    service.log('test', { context: 'test' });

    expect(spy).toHaveBeenCalledWith('test', { context: 'test' });
  });

  it('should be not log when threshold is higher than log level', () => {
    const spy = jest.spyOn(service, 'log');

    service.debug('test', { context: 'test' });

    expect(spy).not.toHaveBeenCalled();
  });
});
