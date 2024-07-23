// Unit tests for: onModuleInit

import { PrismaService } from '../prisma.service';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $connect: jest.fn(),
      };
    }),
  };
});

describe('PrismaService.onModuleInit() onModuleInit method', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  describe('Happy Path', () => {
    it('should connect to the database when onModuleInit is called', async () => {
      // Arrange
      const connectSpy = jest.spyOn(prismaService, '$connect').mockResolvedValueOnce(undefined);

      // Act
      await prismaService.onModuleInit();

      // Assert
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle connection errors gracefully', async () => {
      // Arrange
      const connectSpy = jest.spyOn(prismaService, '$connect').mockRejectedValueOnce(new Error('Connection error'));

      // Act & Assert
      await expect(prismaService.onModuleInit()).rejects.toThrow('Connection error');
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should not attempt to connect if already connected', async () => {
      // Arrange
      prismaService.$connect = jest.fn().mockResolvedValueOnce(undefined);
      prismaService['isConnected'] = true; // Simulating already connected state

      // Act
      await prismaService.onModuleInit();

      // Assert
      expect(prismaService.$connect).not.toHaveBeenCalled();
    });

    it('should handle cases where the service is disabled', async () => {
      // Arrange
      prismaService['enabled'] = false; // Simulating disabled state

      // Act
      await prismaService.onModuleInit();

      // Assert
      expect(prismaService.$connect).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: onModuleInit
