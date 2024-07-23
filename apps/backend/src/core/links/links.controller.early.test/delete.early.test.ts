// Unit tests for: delete

import { UnauthorizedException } from '@nestjs/common';

import { Link } from '@reduced.to/prisma';

import { LinksController } from '../links.controller';

interface MockUserContext {
  id: string;
}

class MockLinksService {
  findBy = jest.fn();
  delete = jest.fn();
}

class MockAppCacheService {
  del = jest.fn();
}

describe('LinksController.delete() delete method', () => {
  let linksService: MockLinksService;
  let cacheService: MockAppCacheService;
  let controller: LinksController;
  let mockUser: MockUserContext;

  beforeEach(() => {
    linksService = new MockLinksService();
    cacheService = new MockAppCacheService();
    controller = new LinksController(linksService as any, cacheService as any);
    mockUser = { id: 'user-id' };
  });

  describe('Happy Path', () => {
    it('should delete a link successfully', async () => {
      // Arrange
      const linkId = 'link-id';
      const mockLink = { id: linkId, key: 'link-key' } as Link;
      linksService.findBy.mockResolvedValue(mockLink as any);
      linksService.delete.mockResolvedValue(mockLink as any);
      cacheService.del.mockResolvedValue(undefined);

      // Act
      const result = await controller.delete(mockUser as any, linkId);

      // Assert
      expect(result).toEqual(mockLink);
      expect(linksService.findBy).toHaveBeenCalledWith({ userId: mockUser.id, id: linkId });
      expect(cacheService.del).toHaveBeenCalledWith(mockLink.key);
      expect(linksService.delete).toHaveBeenCalledWith(linkId);
    });
  });

  describe('Edge Cases', () => {
    it('should throw UnauthorizedException if link is not found', async () => {
      // Arrange
      const linkId = 'link-id';
      linksService.findBy.mockResolvedValue(null);

      // Act & Assert
      await expect(controller.delete(mockUser as any, linkId)).rejects.toThrow(UnauthorizedException);
      expect(linksService.findBy).toHaveBeenCalledWith({ userId: mockUser.id, id: linkId });
      expect(cacheService.del).not.toHaveBeenCalled();
      expect(linksService.delete).not.toHaveBeenCalled();
    });

    it('should handle errors from linksService.delete gracefully', async () => {
      // Arrange
      const linkId = 'link-id';
      const mockLink = { id: linkId, key: 'link-key' } as Link;
      linksService.findBy.mockResolvedValue(mockLink as any);
      linksService.delete.mockRejectedValue(new Error('Delete failed'));
      cacheService.del.mockResolvedValue(undefined);

      // Act & Assert
      await expect(controller.delete(mockUser as any, linkId)).rejects.toThrow(Error);
      expect(linksService.findBy).toHaveBeenCalledWith({ userId: mockUser.id, id: linkId });
      expect(cacheService.del).toHaveBeenCalledWith(mockLink.key);
      expect(linksService.delete).toHaveBeenCalledWith(linkId);
    });

    it('should handle errors from cacheService.del gracefully', async () => {
      // Arrange
      const linkId = 'link-id';
      const mockLink = { id: linkId, key: 'link-key' } as Link;
      linksService.findBy.mockResolvedValue(mockLink as any);
      linksService.delete.mockResolvedValue(mockLink as any);
      cacheService.del.mockRejectedValue(new Error('Cache delete failed'));

      // Act & Assert
      await expect(controller.delete(mockUser as any, linkId)).resolves.toEqual(mockLink);
      expect(linksService.findBy).toHaveBeenCalledWith({ userId: mockUser.id, id: linkId });
      expect(cacheService.del).toHaveBeenCalledWith(mockLink.key);
      expect(linksService.delete).toHaveBeenCalledWith(linkId);
    });
  });
});

// End of unit tests for: delete
