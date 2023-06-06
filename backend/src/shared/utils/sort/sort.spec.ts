import { orderByBuilder } from './sort';
import { SortOrder } from '../../enums/sort-order.enum';

describe('orderByBuilder', () => {
  it('should return undefined if sortDto is undefined', () => {
    const sortDto = undefined;

    const result = orderByBuilder(sortDto);
    expect(result).toBeUndefined();
  });

  it('should return undefined if sortDto is empty', () => {
    const sortDto = {};

    const result = orderByBuilder(sortDto);
    expect(result).toBeUndefined();
  });

  it('should return good orderBy clause if sortDto is full', () => {
    const sortDto = { name: SortOrder.DESCENDING, email: SortOrder.ASCENDING };

    const result = orderByBuilder(sortDto);
    expect(result).toEqual({ orderBy: [{ name: 'desc' }, { email: 'asc' }] });
  });
});
