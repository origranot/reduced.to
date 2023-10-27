import { component$ } from '@builder.io/qwik';
import { Columns, TableServerPagination } from '../../../../components/table/table-server-pagination';

export default component$(() => {
  const columns: Columns = {
    name: { displayName: 'Name' },
    email: {},
    role: {},
  };

  return (
    <>
      <TableServerPagination endpoint={`${process.env.API_DOMAIN}/api/v1/users`} columns={columns} />
    </>
  );
});
