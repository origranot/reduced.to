import { Test, TestingModule } from '@nestjs/testing';
import { SafeUrlService } from './safe-url.service';
import { Checker } from './checkers/checker';

class MockChecker implements Checker {
  async isSafeUrl(url: string): Promise<boolean> {
    return true; // Mock returning true for a safe URL.
  }
}

describe('SafeUrlService', () => {
  let service: SafeUrlService;
  let mockCheckers: Checker[];

  beforeEach(async () => {
    mockCheckers = [new MockChecker(), new MockChecker()];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafeUrlService,
        {
          provide: 'CHECKERS',
          useValue: mockCheckers,
        },
      ],
    }).compile();

    service = module.get<SafeUrlService>(SafeUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if all checkers return true', async () => {
    for (const checker of mockCheckers) {
      jest.spyOn(checker, 'isSafeUrl').mockResolvedValue(true);
    }
    await expect(service.isSafeUrl('http://example.com')).resolves.toBe(true);
  });

  it('should return false if any checker returns false', async () => {
    jest.spyOn(mockCheckers[0], 'isSafeUrl').mockResolvedValue(true);
    jest.spyOn(mockCheckers[1], 'isSafeUrl').mockResolvedValue(false); // One checker reports URL as not safe
    await expect(service.isSafeUrl('http://example.com')).resolves.toBe(false);
  });
});
