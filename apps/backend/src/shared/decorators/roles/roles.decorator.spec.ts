import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { Role } from '@reduced.to/prisma';
import { Roles, ROLES_KEY } from './roles.decorator';

describe('Roles Decorator', () => {
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Reflector],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
  });

  it('should set metadata with roles', () => {
    const roles = [Role.ADMIN, Role.USER]; // Replace with the roles you want to test

    // Sample controller to simulate the context
    class TestController {
      @Roles(...roles)
      testMethod() {
        // Empty method
      }
    }

    const testController = new TestController();

    const result = reflector.get<Role[]>(ROLES_KEY, testController.testMethod);
    expect(result).toEqual(roles);
  });

  it('should set metadata with empty array of roles', () => {
    const roles = []; // Replace with the roles you want to test

    // Sample controller to simulate the context
    class TestController {
      @Roles(...roles)
      testMethod() {
        // Empty method
      }
    }

    const testController = new TestController();

    const result = reflector.get<Role[]>(ROLES_KEY, testController.testMethod);
    expect(result).toEqual(roles);
  });

  it('should not set any metadata of roles', () => {
    // Sample controller to simulate the context
    class TestController {
      testMethod() {
        // Empty method
      }
    }

    const testController = new TestController();

    const result = reflector.get<Role[]>(ROLES_KEY, testController.testMethod);
    expect(result).toEqual(undefined);
  });
});
