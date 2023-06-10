import { orderByBuilder } from './sort';
import { SortOrder } from '../../enums/sort-order.enum';

describe('orderByBuilder', () => {
  it('should return null if dto is undefined', () => {
    const dto = undefined;

    const result = orderByBuilder(dto);
    expect(result).toBeNull();
  });

  it('should return null if dto is an empty object', () => {
    const sortDto = {};

    const result = orderByBuilder(sortDto);
    expect(result).toBeNull();
  });

  it('should return orderBy clause if dto is with properties', () => {
    const dto = { name: SortOrder.DESCENDING, email: SortOrder.ASCENDING };

    const result = orderByBuilder(dto);
    expect(result).toEqual([{ name: 'desc' }, { email: 'asc' }]);
  });
});
