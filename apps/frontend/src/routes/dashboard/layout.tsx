import { component$, Slot, useSignal, $ } from '@builder.io/qwik';
import { Link, RequestHandler, useLocation } from '@builder.io/qwik-city';
import { validateAccessToken } from '../../shared/auth.service';
import { Role, useGetCurrentUser } from '../layout';
import { LuAlertOctagon, LuLineChart, LuLink, LuShield, LuSlidersHorizontal, LuUsers } from '@qwikest/icons/lucide';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const validAccessToken = await validateAccessToken(cookie);
  if (!validAccessToken) {
    throw redirect(302, '/');
  }
};

export default component$(() => {
  const location = useLocation();
  const user = useGetCurrentUser();

  const isDrawerOpen = useSignal(false);
  const isDrawer2Open = useSignal(false);
  const toggleDrawer = $(() => (isDrawerOpen.value = !isDrawerOpen.value));
  const toggleDrawer2 = $(() => (isDrawer2Open.value = !isDrawer2Open.value));
  return (
    <div class="drawer lg:drawer-open min-h-[calc(100vh-64px)] inline-block sm:grid">
      <input id="drawer" type="checkbox" class="drawer-toggle" checked={isDrawerOpen.value} onChange$={toggleDrawer} />
      <div class={`drawer-content w-100vh m-5 ${
        isDrawer2Open.value ? 'drawer-side-open' : 'drawer-side-closed'
      }`}>
        <Slot />
      </div>
      <div class="drawer-side flex">
      <button class={`text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 transition-transform ${
          isDrawer2Open.value ? '-translate-x-full opacity-0 pointer-events-none' : '-translate-x-full'
        }`} type="button" data-drawer-target="drawer-disable-body-scrolling" data-drawer-show="drawer-disable-body-scrolling" data-drawer-body-scrolling="false" aria-controls="drawer-disable-body-scrolling" onClick$={toggleDrawer2}>
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
  </svg>
   </button>
      </div>
      <div id="drawer-disable-body-scrolling"
        class={`drawer-side absolute transition-transform ${
          isDrawer2Open.value ? '' : '-translate-x-full'
        }`}
        aria-labelledby="drawer-disable-body-scrolling-label">
  <div class="py-4 overflow-y-auto">
  <button type="button" class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center" onClick$={toggleDrawer2}>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span class="sr-only">Close menu</span>
   </button>
      {/* <label for="drawer" class="drawer-overlay"></label> */}
        <ul class="menu p-4 w-64 text-base-content border-r bg-base-100 dark:border-gray-700 block h-full">
          <li class="py-1 mt-1">
            <Link
              href="/dashboard"
              class={`${location.url.pathname.slice(0, -1) === '/dashboard' ? 'active' : ''}`}
              onClick$={toggleDrawer}
            >
              <LuLink class="w-5 h-5" />
              <span class="font-medium">My Links</span>
            </Link>
          </li>
          <li class="py-1 mt-1">
            <Link
              href="/dashboard/settings"
              class={`${location.url.pathname.slice(0, -1) === '/dashboard/settings' ? 'active' : ''}`}
              onClick$={toggleDrawer}
            >
              <LuSlidersHorizontal class="w-5 h-5" />
              <span class="justify-between font-medium">Settings</span>
            </Link>
          </li>
          {user.value?.role === Role.ADMIN && (
            <>
              <div class="divider"></div>
              <li>
                <details open={true}>
                  <summary class="font-medium">
                    <LuShield class="w-5 h-5" />
                    Admin Panel
                  </summary>
                  <ul>
                    <li class="py-1 mt-1">
                      <Link
                        class={`${location.url.pathname.slice(0, -1) === '/dashboard/admin/analytics' ? 'active' : ''} !cursor-not-allowed`}
                        onClick$={toggleDrawer}
                      >
                        <LuLineChart class="w-5 h-5" />
                        <span class="font-medium">Analytics</span>
                        <span class="badge badge-primary">Soon</span>
                      </Link>
                    </li>
                    <li class="py-1 mt-1">
                      <Link
                        href="/dashboard/admin/users"
                        class={`${location.url.pathname.slice(0, -1) === '/dashboard/admin/users' ? 'active' : ''}`}
                        onClick$={toggleDrawer}
                      >
                        <LuUsers class="w-5 h-5" />
                        <span class="font-medium">Users</span>
                      </Link>
                    </li>
                    <li class="py-1 mt-1">
                      <Link
                        href="/dashboard/admin/reports"
                        class={`${location.url.pathname.slice(0, -1) === '/dashboard/admin/reports' ? 'active' : ''}`}
                        onClick$={toggleDrawer}
                      >
                        <LuAlertOctagon class="w-5 h-5" />
                        <span class="font-medium">Reports</span>
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          )}
        </ul>
        </div>
      </div>
      </div>
  );
});
