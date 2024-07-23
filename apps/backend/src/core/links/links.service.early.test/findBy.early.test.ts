// Unit tests for: findBy

import { Link } from '@reduced.to/prisma';

import { LinksService } from '../links.service';

class MockPrismaService {
  public link = {
    findFirst: jest.fn(),
  };
}

describe('LinksService.findBy() findBy method', () => {
  let linksService: LinksService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService() as any;
    linksService = new LinksService(mockPrismaService as any);
  });

  describe('findBy', () => {
    it('should return a link when a valid condition is provided', async () => {
      // Arrange
      const mockLink: Link = {
        id: '1',
        url: 'http://example.com',
        key: 'example',
        clicks: 10,
        description: 'An example link',
        utm: null,
        expirationTime: null,
        createdAt: new Date(),
      } as any;

      mockPrismaService.link.findFirst.mockResolvedValue(mockLink);

      // Act
      const result = await linksService.findBy({ id: '1' });

      // Assert
      expect(result).toEqual(mockLink);
      expect(mockPrismaService.link.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when no link matches the condition', async () => {
      // Arrange
      mockPrismaService.link.findFirst.mockResolvedValue(null);

      // Act
      const result = await linksService.findBy({ id: 'non-existent-id' });

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaService.link.findFirst).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });

    it('should handle errors thrown by the Prisma service', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockPrismaService.link.findFirst.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(linksService.findBy({ id: '1' })).rejects.toThrow(errorMessage);
      expect(mockPrismaService.link.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return a link when searching by key', async () => {
      // Arrange
      const mockLink: Link = {
        id: '2',
        url: 'http://example2.com',
        key: 'example2',
        clicks: 5,
        description: 'Another example link',
        utm: null,
        expirationTime: null,
        createdAt: new Date(),
      } as any;

      mockPrismaService.link.findFirst.mockResolvedValue(mockLink);

      // Act
      const result = await linksService.findBy({ key: 'example2' });

      // Assert
      expect(result).toEqual(mockLink);
      expect(mockPrismaService.link.findFirst).toHaveBeenCalledWith({
        where: { key: 'example2' },
      });
    });

    it('should return null when searching by key that does not exist', async () => {
      // Arrange
      mockPrismaService.link.findFirst.mockResolvedValue(null);

      // Act
      const result = await linksService.findBy({ key: 'non-existent-key' });

      // Assert
      expect(result).toBeNull();
      expect(mockPrismaService.link.findFirst).toHaveBeenCalledWith({
        where: { key: 'non-existent-key' },
      });
    });
  });
});

// End of unit tests for: findBy
