import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import styles from './profile.css?inline';

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
          <a class="justify-between">
            Settings
            <span class="badge">Soon</span>
          </a>
        </li>
        <li>
          <Link href="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
});
