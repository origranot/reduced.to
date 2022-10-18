import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from './config.module';
import { AppConfigService } from './config.service';

describe('ConfigServie', () => {
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
});
