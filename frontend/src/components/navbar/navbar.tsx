import { component$, useContext, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { GlobalStore } from '../../context';
import { UserCtx } from '../../routes/layout';
import {
  DARK_THEME,
  LIGHT_THEME,
  setPreference,
  ThemeSwitcher,
} from '../theme-switcher/theme-switcher';
import { BurgerButton } from './burger-button/burger-button';
import { GithubButton } from './github-button/github-button';
import styles from './navbar.css?inline';
import { Profile } from './profile/profile';

interface NavbarProps {
  user: UserCtx | null;
}

export const Navbar = component$(({ user }: NavbarProps) => {
  useStylesScoped$(styles);

  const globalStore = useContext(GlobalStore);

  return (
    <div class="navbar bg-base-100 drop-shadow-md">
      <div class="flex-1">
        <Link href="/" class="btn btn-ghost normal-case text-xl">
          Reduced.to
        </Link>
      </div>
      <div class="block sm:hidden dropdown dropdown-end">
        <BurgerButton buttonTitle="Open" />
        <ul tabIndex={0} class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
          <li class={user ? 'px-4 py-2' : ''}>
            {user ? (
              `Welcome ${user.name}!`
            ) : (
              <Link href="/login" class="btn-ghost">
                Login
              </Link>
            )}
          </li>
          {user && (
            <>
              <li class="pr-2 border-black"></li>
              <li>
                <label class="btn-ghost py-2 text-sm justify-between">
                  Settings
                  <span class="badge">Soon</span>
                </label>
                <Link href="/logout" class="btn-ghost py-2 text-sm">
                  Logout
                </Link>
              </li>
              <li class="pr-2 border-black"></li>
            </>
          )}
          <li>
            <a
              href="https://github.com/origranot/reduced.to"
              target="_blank"
              title="GitHub"
              class="btn-ghost"
            >
              Github
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
        {user ? (
          <Profile name={user.name} />
        ) : (
          <Link href="/login" class="btn btn-primary btn-sm">
            Login
          </Link>
        )}
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
