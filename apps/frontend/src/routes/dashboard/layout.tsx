import { component$, Slot, useSignal, $ } from '@builder.io/qwik';
import { Link, RequestHandler, useLocation } from '@builder.io/qwik-city';
import { validateAccessToken } from '../../shared/auth.service';
import { Role, useGetCurrentUser } from '../layout';
import { LuAlertOctagon, LuLayoutDashboard, LuLineChart, LuLink, LuShield, LuSlidersHorizontal, LuUsers } from '@qwikest/icons/lucide';

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
  const toggleDrawer = $(() => (isDrawerOpen.value = !isDrawerOpen.value));

  return (
    <div class="drawer lg:drawer-open min-h-[calc(100vh-64px)] inline-block sm:grid">
      <input id="drawer" type="checkbox" class="drawer-toggle" checked={isDrawerOpen.value} onChange$={toggleDrawer} />
      <div class="drawer-content w-100vh m-5">
        <Slot />
      </div>
      <div class="drawer-side absolute">
        <label for="drawer" class="drawer-overlay"></label>
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
            <Link class={`${location.url.pathname.slice(0, -1) === '/dashboard/settings' ? 'active' : ''} !cursor-not-allowed`}>
              <LuSlidersHorizontal class="w-5 h-5" />
              <span class="justify-between font-medium">Settings</span>
              <span class="badge badge-primary">Soon</span>
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
  );
});
