import { Signal, component$, useSignal } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { type User } from '@reduced.to/prisma';
import classnames from 'classnames';

interface UsersDataResponse {
  numOfPages: number;
  total: number;
  data: User[];
}

interface ErrorSignal {
  visible: boolean;
  message: string;
}

interface Error {
  errMessage: string;
}

const getPaginatedUsers = async (page: number, accessToken: string) => {
  const data = await fetch(`${process.env.API_DOMAIN}/api/v1/users?page=${page}&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  });
  return data;
};

const switchPages = async (page: number, accessToken: string, usersSignal: Signal<UsersDataResponse>, errorSignal: Signal<ErrorSignal>) => {
  const data = await getPaginatedUsers(page, accessToken);
  const jsonData = await data.json();

  if (data.status !== 200) {
    errorSignal.value = { visible: true, message: jsonData.message };
    setTimeout(() => {
      errorSignal.value = { visible: false, message: '' };
    }, 3000);
    return;
  }
  usersSignal.value = jsonData;
};

let accessToken: string;

export const useUsersDataLoader = routeLoader$<UsersDataResponse & Error>(async ({ cookie, fail }) => {
  accessToken = cookie.get('accessToken')?.value as string;
  const data = await getPaginatedUsers(1, accessToken);
  const jsonData = await data.json();

  if (data.status !== 200) {
    return fail<{ errMessage: string }>(data.status, { errMessage: jsonData.message });
  }
  return jsonData;
});

export default component$(() => {
  const firstUsersPages = useUsersDataLoader();
  const page = useSignal(1);
  const users = useSignal(firstUsersPages.value);
  const error = useSignal({ visible: false, message: '' });
  if (firstUsersPages.value.errMessage) {
    return <h1>{firstUsersPages.value.errMessage}</h1>;
  }
  return (
    <>
      <h1 class="font-medium">Users</h1>
      <div class={classnames('toast toast-end', { hidden: error.value.visible === false })}>
        <div class="alert alert-error">
          <span>{error.value.message}</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>email</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            {users.value.data.map((user, index) => {
              return (
                <tr class="hover">
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div class="mt-6">
        Page {page.value} of {users.value.numOfPages}
      </div>
      <div class="flex items-center justify-center gap-10 mt-6">
        <button
          onClick$={async () => {
            page.value--;
            await switchPages(page.value, accessToken, users, error);
          }}
          class={classnames('btn btn-neutral btn-sm', { 'btn-disabled': page.value === 1 || error.value.visible === true })}
        >
          Previous
        </button>
        <button
          onClick$={async () => {
            page.value++;
            await switchPages(page.value, accessToken, users, error);
          }}
          class={classnames('btn btn-neutral btn-sm', {
            'btn-disabled': page.value === users.value.numOfPages || error.value.visible === true,
          })}
        >
          Next
        </button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Users',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Users',
    },
    {
      name: 'description',
      content: 'Reduced.to | Users, see other users, and more!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard/admin',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Users',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Users, see other users, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Users',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Users, see other users, and more!',
    },
  ],
};
