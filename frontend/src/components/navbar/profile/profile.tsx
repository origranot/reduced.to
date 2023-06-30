import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Form, Link } from '@builder.io/qwik-city';
import styles from './profile.css?inline';
import { useAuthSignout } from '~/routes/plugin@auth';

interface ProfileProps {
  name: string;
}

export const Profile = component$(({ name }: ProfileProps) => {
  useStylesScoped$(styles);

  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
        <div class="w-8 rounded-full">
          <img src={`https://ui-avatars.com/api/?name=${name}`} />
        </div>
      </label>
      <ul
        tabIndex={0}
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48"
      >
        <li>
          <Link href="/dashboard" class="justify-between">
            Dashboard
            <span class="badge">New</span>
          </Link>
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    </div>
  );
});


export const Logout = component$(() => {
  useStylesScoped$(styles);
  const signOut = useAuthSignout();

  return (
    <Form action={signOut} class={''}>
      <input type="hidden" name="options.callbackUrl" value="/" />
      <button class={''}>Logout</button>
    </Form>
  );
});
