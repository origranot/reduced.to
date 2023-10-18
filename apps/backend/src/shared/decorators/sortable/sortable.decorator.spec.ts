import { validate } from 'class-validator';
import { Sortable } from './sortable.decorator';
import { SortOrder } from '../../enums/sort-order.enum';
import { BadRequestException } from '@nestjs/common';

class TestDto {
  @Sortable(['name', 'email', 'role'])
  sort?: Record<string, SortOrder>;
}

describe('Sortable Decorator', () => {
  it('should pass validation if sort field is empty', async () => {
    const dto = new TestDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation for valid sort fields and orders', async () => {
    const dto = new TestDto();

    dto.sort = {
      name: SortOrder.ASCENDING,
      email: SortOrder.DESCENDING,
      role: SortOrder.ASCENDING,
    };

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should throw BadRequestException for invalid sort fields', async () => {
    const dto = new TestDto();

    dto.sort = {
      name: SortOrder.ASCENDING,
      invalidField: SortOrder.DESCENDING,
      role: SortOrder.ASCENDING,
    };

    await expect(validate(dto)).rejects.toThrowError(new BadRequestException('Invalid sort field: invalidField'));
  });

  it('should throw BadRequestException for invalid sort orders', async () => {
    const dto = new TestDto();

    dto.sort = {
      name: SortOrder.ASCENDING,
      email: 'invalidOrder' as any,
      role: SortOrder.ASCENDING,
    };

    await expect(validate(dto)).rejects.toThrowError(new BadRequestException('Invalid sort order: invalidOrder'));
  });
});
