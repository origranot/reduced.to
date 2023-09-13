import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { GlobalStore } from '../../context';
import { DARK_THEME, LIGHT_THEME, setPreference, ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { BurgerButton } from './burger-button/burger-button';
import { GithubButton } from './github-button/github-button';
import styles from './navbar.css?inline';
import { Profile } from './profile/profile';
import { useAuthSignout } from '~/routes/plugin@auth';
import { UserAuthStatusContext } from '~/routes/layout';

export const Navbar = component$(() => {
  useStylesScoped$(styles);

  const globalStore = useContext(GlobalStore);
  const location = useLocation();
  const props = useContext(UserAuthStatusContext);
  const signout = useAuthSignout();

  return (
    <div class="navbar bg-base-100 drop-shadow-md relative" style={{ zIndex: 100 }}>
      <div class="flex-1">
        {location.url.pathname.includes('/dashboard') && ( // Only show the left 3 bars button on the dashboard page
          <>
            <label for="drawer" class="btn btn-ghost btn-circle lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </label>
          </>
        )}
        <Link href="/" class="btn btn-ghost normal-case text-xl">
          Reduced.to
        </Link>
      </div>
      <div class="block sm:hidden dropdown dropdown-end">
        <BurgerButton buttonTitle="Open" />
        <ul tabIndex={0} class="menu dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 p-2">
          <li class={props.isLogIn ? 'px-4 py-2' : ''}>
            {props.user ? (
              `Welcome ${props.user?.name}!`
            ) : (
              <Link href="/login" class="btn-ghost">
                Login
              </Link>
            )}
          </li>
          {props.isLogIn && (
            <>
              <li class="pr-2 border-black"></li>
              <li>
                <Link href="/dashboard" class="btn-ghost py-2 text-sm justify-between">
                  Dashboard
                  <span class="badge">New</span>
                </Link>
                {
                !props.isProvider ? 
                <a href="/logout" class="btn-ghost py-2 text-sm">
                  Logout
                </a> :
                <button onClick$={() => signout.submit({ callbackUrl: '/logout' })} class={'btn-ghost py-2 text-sm'} type="submit">
                    Logout
                </button>
                }
              </li>
              <li class="pr-2 border-black"></li>
            </>
          )}
          <li>
            <a href="https://github.com/origranot/reduced.to" target="_blank" title="GitHub" class="btn-ghost">
              Github
            </a>
          </li>
          <li>
            <a href="https://docs.reduced.to" target="_blank" title="Documentation" class="btn-ghost">
              Docs
            </a>
          </li>
          <li>
            <a
              class="btn-ghost"
              onClick$={() => {
                globalStore.theme = globalStore.theme === 'light' ? DARK_THEME : LIGHT_THEME;
                setPreference(globalStore.theme);
              }}
            >
              {globalStore.theme === 'light' ? 'Dark' : 'Light'} theme
            </a>
          </li>
        </ul>
      </div>
      <div class="sm:flex hidden">
        {props.isLogIn ? (
          <Profile />
        ) : (
          <Link href="/login" class="btn btn-primary btn-sm">
            Login
          </Link>
          
        )}
        <div class="divider divider-horizontal"></div>
        <a href="https://docs.reduced.to" class="btn btn-ghost">
          Docs
        </a>
        <div class="divider divider-horizontal"></div>
        <div class="grid flex-grow place-items-center">
          <GithubButton />
        </div>
        <div class="divider divider-horizontal"></div>
        <div class="grid flex-grow place-items-center">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
});
