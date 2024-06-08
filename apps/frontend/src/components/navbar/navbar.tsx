import { component$, useContext, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { GlobalStore } from '../../context';
import { useGetCurrentUser } from '../../routes/layout';
import { BurgerButton } from '../dashboard/navbar/burger-button/burger-button';
import { DARK_THEME, LIGHT_THEME, ThemeSwitcher, setPreference } from '../theme-switcher/theme-switcher';

export const Navbar = component$(() => {
  const globalStore = useContext(GlobalStore);
  const user = useGetCurrentUser();
  const showDropdown = useSignal(false);

  return (
    <div class="navbar bg-base-100 drop-shadow-md dark:shadow-slate-700 shadow-sm fixed z-[40] lg:px-20">
      <div class="flex-1 flex items-center">
        <a href="/" class="btn btn-ghost normal-case text-xl">
          Reduced.to
        </a>
        <div class="hidden sm:flex flex-grow justify-start space-x-4 ml-6">
          <a title="Features" href="/features" class="btn btn-sm btn-ghost">
            Features
          </a>
          <a title="Pricing" href="/pricing" class="btn btn-sm btn-ghost">
            Pricing
          </a>
          <a href="https://docs.reduced.to" target="_blank" title="Documentation" class="btn btn-sm btn-ghost">
            Docs
          </a>
        </div>
      </div>
      <div
        class="block sm:hidden dropdown dropdown-end"
        onFocusout$={({ target }, currentTarget) => {
          if (target instanceof HTMLElement && currentTarget.contains(target as Node)) {
            return;
          }

          showDropdown.value = false;
        }}
        onClick$={() => (showDropdown.value = !showDropdown.value)}
      >
        <BurgerButton buttonTitle="Open" />
        {showDropdown.value && (
          <ul tabIndex={0} class="menu dropdown-content shadow bg-base-100 rounded-box w-52 mt-4 p-2">
            <li>
              <Link href="/features" class="btn-ghost">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" class="btn-ghost">
                Pricing
              </Link>
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
                  globalStore.theme = globalStore.theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
                  setPreference(globalStore.theme);
                }}
              >
                {globalStore.theme === LIGHT_THEME ? 'Dark' : 'Light'} theme
              </a>
            </li>
            <li class="pr-2 border-black"></li>
            <li>
              {user.value ? (
                <Link href="/dashboard" class="btn-ghost py-2 text-sm justify-between">
                  Dashboard
                  <span class="badge badge-primary">New</span>
                </Link>
              ) : (
                <Link href="/login" class="btn-ghost">
                  Login
                </Link>
              )}
            </li>
          </ul>
        )}
      </div>
      <div class="hidden sm:flex items-center space-x-4">
        {user.value ? (
          <Link href="/dashboard" class="btn btn-primary btn-sm">
            Dashboard
          </Link>
        ) : (
          <Link href="/login" class="btn btn-primary btn-sm">
            Login
          </Link>
        )}
        <div class="divider divider-horizontal"></div>
        <div class="grid flex-grow place-items-center mr-4">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
});
