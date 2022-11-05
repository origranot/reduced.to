import { component$, useClientEffect$, useContext } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { GlobalStore } from '~/context';
import { eraseCookie, getUser, User } from '~/shared/auth.service';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export interface Store {
  user: User | null;
}

export const Navbar = component$(() => {
  const navigate = useNavigate();

  const globalStore = useContext(GlobalStore);

  useClientEffect$(() => {
    globalStore.user = getUser();
  });

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="flex-1">
        <a href="/">
          <img src="logo.png" className="h-10" alt="Logo" />
        </a>
      </div>
      <div className="flex-none">
        <div className="flex">
          <div className="grid flex-grow place-items-center">
            <ThemeSwitcher />
          </div>
          <div className="divider divider-horizontal"></div>
        </div>
        <div className="flex place-items-center">
          {globalStore.user ? (
            <>
              <div className="dropdown dropdown-end">
                <label className="flex">
                  Welcome
                  <div tabIndex={0} className="flex cursor-pointer pl-1">
                    <span className="font-bold">{globalStore.user.firstName}</span>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="caret-down"
                      class="w-2 ml-2"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                      ></path>
                    </svg>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-5 p-2 shadow bg-base-100 rounded w-52"
                >
                  <li className="rounded">
                    <a
                      onClick$={() => {
                        eraseCookie('s_id');
                        globalStore.user = null;
                      }}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="mr-2">
                <button
                  class="btn btn-sm btn-outline btn-primary"
                  onClick$={() => {
                    navigate.path = '/login';
                  }}
                >
                  Log In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
