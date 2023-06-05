import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { IsVerified, IS_VERFIED_KEY } from './is-verified.decorator';

describe('IsVerified Decorator', () => {
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Reflector],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
  });

  it('should set metadata when using the decorator', () => {
    // Sample controller to simulate the context
    class TestController {
      @IsVerified()
      testMethod() {}
    }

    const testController = new TestController();

    const result = reflector.get<boolean>(IS_VERFIED_KEY, testController.testMethod);
    expect(result).toEqual(true);
  });
});
