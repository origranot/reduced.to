import { component$ } from '@builder.io/qwik';
import { TableServerPagination } from 'apps/frontend/src/components/table/table-server-pagination';

export default component$(() => {
  return (
    <div class="flex flex-col justify-start">
      <TableServerPagination endpoint={`${process.env.API_DOMAIN}/api/v1/users`} />
    </div>
  );
});
