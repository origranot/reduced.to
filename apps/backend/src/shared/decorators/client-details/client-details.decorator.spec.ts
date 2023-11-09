import { ExecutionContext } from '@nestjs/common';
import { ClientDetails, IClientDetails } from './client-details.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

describe('ClientDetails Decorator', () => {
  const getParamDecoratorFactory = () => {
    class TestDecorator {
      public test(@ClientDetails() _value: IClientDetails) {
        // Empty function for testing purposes
      }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
    return args[Object.keys(args)[0]].factory;
  };

  const handleDecorator = getParamDecoratorFactory();

  const getMockContext = (mockRequest: object) => {
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  it('should extract client details from the request', () => {
    const IP = '192.168.1.1';
    const USER_AGENT = 'Test User Agent';

    const mockContext = getMockContext({
      headers: {
        'x-real-ip': IP,
        'user-agent': USER_AGENT,
      },
      socket: {
        remoteAddress: '192.168.1.2',
      },
    });

    const result = handleDecorator(null, mockContext);

    expect(result).toEqual({
      ip: IP,
      userAgent: USER_AGENT,
    });
  });

  it('should extract client details from the request when x-forwarded-for is not present', () => {
    const IP = '192.168.1.1';
    const USER_AGENT = 'Test User Agent';

    const mockContext = getMockContext({
      headers: {
        'user-agent': USER_AGENT,
      },
      socket: {
        remoteAddress: IP,
      },
    });

    const result = handleDecorator(null, mockContext);

    expect(result).toEqual({
      ip: IP,
      userAgent: USER_AGENT,
    });
  });

  it('should extract client details from the request when user-agent is not present', () => {
    const IP = '192.168.1.1';
    const USER_AGENT = undefined;

    const mockContext = getMockContext({
      headers: {},
      socket: {
        remoteAddress: IP,
      },
    });

    const result = handleDecorator(null, mockContext);

    expect(result).toEqual({
      ip: IP,
      userAgent: USER_AGENT,
    });
  });
});
