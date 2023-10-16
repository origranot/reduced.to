import { component$, useContext, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { GlobalStore } from '../../context';
import { useGetCurrentUser } from '../../routes/layout';
import { DARK_THEME, LIGHT_THEME, setPreference, ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { BurgerButton } from './burger-button/burger-button';
import { GithubButton } from './github-button/github-button';
import styles from './navbar.css?inline';
import { Profile } from './profile/profile';

export const Navbar = component$(() => {
  useStylesScoped$(styles);

  const globalStore = useContext(GlobalStore);
  const user = useGetCurrentUser();
  const location = useLocation();

  const showDropdown = useSignal(false);

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
      <div
        class="block sm:hidden dropdown dropdown-end"
        onFocusout$={({ relatedTarget }, currentTarget) => {
          if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget as Node)) {
            return;
          }

          showDropdown.value = false;
        }}
        onClick$={() => (showDropdown.value = !showDropdown.value)}
      >
        <BurgerButton buttonTitle="Open" />
        {showDropdown.value && (
          <ul tabIndex={0} class="menu dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 p-2">
            <li class={user.value ? 'px-4 py-2' : ''}>
              {user.value ? (
                `Welcome ${user.value?.name}!`
              ) : (
                <Link href="/login" class="btn-ghost">
                  Login
                </Link>
              )}
            </li>
            {user.value && (
              <>
                <li class="pr-2 border-black"></li>
                <li>
                  <Link href="/dashboard" class="btn-ghost py-2 text-sm justify-between">
                    Dashboard
                    <span class="badge">New</span>
                  </Link>
                  {/* It uses normal redirect inorder to make the signal work as expected */}
                  <a href="/logout" class="btn-ghost py-2 text-sm">
                    Logout
                  </a>
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
        )}
      </div>
      <div class="sm:flex hidden">
        {user.value ? (
          <Profile name={user.value?.name} />
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
        <div class="grid flex-grow place-items-center mr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
});
