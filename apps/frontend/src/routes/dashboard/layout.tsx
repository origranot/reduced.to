import { component$, Slot } from '@builder.io/qwik';
import { Link, RequestHandler, useLocation } from '@builder.io/qwik-city';
import { validateAccessToken } from '../../shared/auth.service';
import { Role } from '../plugin@auth';
import { useUserAuthStatus } from '../layout';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const validAccessToken = await validateAccessToken(cookie);
  if (!validAccessToken) {
    throw redirect(302, '/');
  }
};

export default component$(() => {
  const location = useLocation();
  const currentPath = location.url.pathname.slice(0, -1);
  const session = useUserAuthStatus();

  return (
    <div class="drawer drawer-mobile h-[calc(100vh-64px)]">
      <input id="drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content w-100vh m-5" style={{ zIndex: -5 }}>
        <Slot />
      </div>
      <div class="drawer-side">
        <label for="drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-64 text-base-content border-r bg-base-100 dark:border-gray-700 block">
          <li class="py-2 mt-2">
            <Link href="/dashboard" class={`${currentPath === '/dashboard' ? 'active' : ''}`}>
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="font-medium">Dashboard</span>
            </Link>
          </li>
          <li class="py-2 mt-2">
            <Link href="#" class={`${currentPath === '/dashboard/settings' ? 'active' : ''} cursor-not-allowed`}>
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="justify-between font-medium">Settings</span>
              <span class="badge">Soon</span>
            </Link>
          </li>
          {session.user.role === Role.ADMIN && (
            <>
              <div class="divider"></div>
              <li class="py-2 mt-2">
                <Link href="/dashboard/admin" class={`${currentPath === '/dashboard/admin' ? 'active' : ''}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                  <span class="font-medium">Admin Panel</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
});
