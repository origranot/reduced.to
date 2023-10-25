import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

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
          <a href="https://docs.reduced.to">Docs</a>
        </li>
        <li>
          <Link class="btn-ghost py-2 text-sm justify-between !cursor-not-allowed">
            Report
            <span class="badge badge-neutral">Soon</span>
          </Link>
        </li>
      </ul>
    </div>
  );
});
