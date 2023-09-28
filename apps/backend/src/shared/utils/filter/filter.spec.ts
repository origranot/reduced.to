import { filterBuilder } from './filter';

describe('filterBuilder', () => {
  it('should return undefined if fields array is empty', () => {
    const fields = [];
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toBeUndefined();
  });

  it('should return undefined if fields array is undefined', () => {
    const fields = undefined;
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toBeUndefined();
  });

  it('should return undefined if fields array is null', () => {
    const fields = null;
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toBeUndefined();
  });

  it('should return an array of objects with the correct structure', () => {
    const fields = ['field1', 'field2'];
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toEqual([{ field1: { contains: filter } }, { field2: { contains: filter } }]);
  });
});
