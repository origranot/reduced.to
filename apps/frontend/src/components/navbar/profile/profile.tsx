import { Signal, component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import styles from './profile.css?inline';
import { PROFILE_PICTURE_PREFIX } from '../../../shared/auth.service';
import { UserCtx } from '../../../routes/layout';

interface ProfileProps {
  user: Signal<UserCtx>;
}

export const Profile = component$(({ user }: ProfileProps) => {
  useStylesScoped$(styles);

  return (
    <div
      class="dropdown dropdown-hover"
      onClick$={() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }}
    >
      <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
        <div class="w-8 rounded-full">
          <img height={64} width={64} src={user.value.profilePicture} />
        </div>
      </label>
      <ul tabIndex={0} class="p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48">
        <li>
          <Link href="/dashboard" class="justify-between">
            Dashboard
            <span class="badge badge-primary">New</span>
          </Link>
        </li>
        <li>
          <Link href="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
});

export const getProfilePictureUrl = async (id: string, name: string) => {
  const DEFAULT_URL = `https://ui-avatars.com/api/?name=${name}`;
  let url = DEFAULT_URL;

  try {
    const response = await fetch(`${process.env.STORAGE_DOMAIN}/${PROFILE_PICTURE_PREFIX}/${id}`);
    if (response.ok) {
      url = `${process.env.STORAGE_DOMAIN}/${PROFILE_PICTURE_PREFIX}/${id}?lastModified=${response.headers.get('last-modified')}`;
    }
  } catch (err) {
    url = DEFAULT_URL;
  }

  return url;
};
