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
    const fields = {
      field1: true,
      field2: true,
    };
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toEqual([{ field1: { contains: filter } }, { field2: { contains: filter } }]);
  });

  it('should return an array of objects with the correct structure with nested fields', () => {
    const fields = {
      field1: {
        field2: true,
      },
      field3: true,
    };
    const filter = 'test';

    const result = filterBuilder(fields, filter);

    expect(result).toEqual([{ field1: { field2: { contains: filter } } }, { field3: { contains: filter } }]);
  });
});
