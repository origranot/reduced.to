import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuAlertTriangle } from '@qwikest/icons/lucide';

export const Resources = component$(() => {
  return (
    <div
      class="dropdown dropdown-hover"
      onClick$={() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }}
    >
      <label tabIndex={0} class="btn btn-ghost btn-sm">
        Resources
      </label>
      <ul tabIndex={0} class="p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48">
        <li>
          <a href="https://docs.reduced.to" target="_blank">
            Docs
          </a>
        </li>
        <li>
          <Link href="/report" class="btn-ghost py-2 text-sm justify-between">
            Report a Link
            <div class="badge badge-warning gap-2">
              <LuAlertTriangle />
            </div>
          </Link>
        </li>
        <li>
          <a href="https://github.com/origranot/reduced.to" target="_blank" title="GitHub" class="btn-ghost">
            Github
          </a>
        </li>
      </ul>
    </div>
  );
});
