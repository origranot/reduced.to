// Unit tests for: delete

import { LinksService } from '../links.service';

import { NotFoundException } from '@nestjs/common';

class MockPrismaService {
  public link = {
    delete: jest.fn(),
  };

  constructor() {
    this.link.delete.mockResolvedValue({ id: 'mockId', url: 'http://mockurl.com' } as any);
  }
}

describe('LinksService.delete() delete method', () => {
  let linksService: LinksService;
  let mockPrismaService: MockPrismaService;

  beforeEach(() => {
    mockPrismaService = new MockPrismaService();
    linksService = new LinksService(mockPrismaService as any);
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should delete a link successfully', async () => {
      // Arrange
      const linkId = 'mockId';

      // Act
      const result = await linksService.delete(linkId);

      // Assert
      expect(mockPrismaService.link.delete).toHaveBeenCalledWith({
        where: { id: linkId },
        include: { visit: true },
      });
      expect(result).toEqual({ id: 'mockId', url: 'http://mockurl.com' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw NotFoundException if link does not exist', async () => {
      // Arrange
      const linkId = 'nonExistentId';
      mockPrismaService.link.delete.mockRejectedValueOnce(new NotFoundException('Link not found') as any);

      // Act & Assert
      await expect(linksService.delete(linkId)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.link.delete).toHaveBeenCalledWith({
        where: { id: linkId },
        include: { visit: true },
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const linkId = 'mockId';
      mockPrismaService.link.delete.mockRejectedValueOnce(new Error('Unexpected error') as any);

      // Act & Assert
      await expect(linksService.delete(linkId)).rejects.toThrow(Error);
      expect(mockPrismaService.link.delete).toHaveBeenCalledWith({
        where: { id: linkId },
        include: { visit: true },
      });
    });
  });
});

// End of unit tests for: delete
