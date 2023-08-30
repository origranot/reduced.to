import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { Form, Link } from '@builder.io/qwik-city';
import styles from './profile.css?inline';
import { useAuthSignout } from '~/routes/plugin@auth';
import { UserAuthStatusContext } from '~/routes/layout';

export const Profile = component$(() => {
  useStylesScoped$(styles);
  const signout = useAuthSignout();
  const auth = useContext(UserAuthStatusContext);

  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
        <div class="w-8 rounded-full">
          <img src={`https://ui-avatars.com/api/?name=${auth.user.name}`} width={30} height={30} />
        </div>
      </label>
      <ul tabIndex={0} class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48">
        <li>
          <Link href="/dashboard" class="justify-between">
            Dashboard
            <span class="badge">New</span>
          </Link>
        </li>
        <li>
        {!auth.isProvider ? 
          <a href="/logout">Logout</a>
          :
        <Form key={'logout-form'} action={signout}>
          <button type="submit">Logout</button>
        </Form>
        }
        </li>
      </ul>
    </div>
  );
});
