import { orderByBuilder } from './sort';
import { SortOrder } from '@rt/backend/shared/enums/sort-order.enum';

describe('orderByBuilder', () => {
  it('should return undefined if dto is undefined', () => {
    const dto = undefined;

    const result = orderByBuilder(dto);
    expect(result).toBeUndefined();
  });

  it('should return undefined if dto is an empty object', () => {
    const sortDto = {};

    const result = orderByBuilder(sortDto);
    expect(result).toBeUndefined();
  });

  it('should return orderBy clause if dto is with properties', () => {
    const dto = { name: SortOrder.DESCENDING, email: SortOrder.ASCENDING };

    const result = orderByBuilder(dto);
    expect(result).toEqual([{ name: 'desc' }, { email: 'asc' }]);
  });
});
