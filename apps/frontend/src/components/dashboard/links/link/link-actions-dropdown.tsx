import { JSXNode, component$ } from '@builder.io/qwik';
import { HiEllipsisVerticalOutline } from '@qwikest/icons/heroicons';

interface LinkActionsDropdownProps {
  url: string;
  actions: {
    name: string;
    icon: JSXNode;
    class?: string;
    action?: () => any;
    disabled?: boolean;
    soon?: boolean;
    href?: string;
    target?: string;
  }[];
}

export default component$((props: LinkActionsDropdownProps) => {
  return (
    <div class="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" class="btn btn-ghost btn-circle m-1">
        <HiEllipsisVerticalOutline class="w-5 h-5" />
      </div>
      <ul tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-30 text-left">
        {props.actions.map((action) => {
          return (
            <li>
              <a
                href={action.href || '#'}
                target={action.target || '_self'}
                class={`${action.class || ''} menu-link ${action.disabled ? 'disabled' : ''}`}
                onClick$={action.action}
              >
                {action.icon}
                <span class="font-medium">{action.name}</span>
                {action.soon ? <span class="badge badge-primary">Soon</span> : ''}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
