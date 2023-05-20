import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export interface DashboardHeaderProps {
  links: string[];
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const DashboardHeader = component$(({ links }: DashboardHeaderProps) => {
  const pageTitle = capitalizeFirstLetter(links[links.length - 1]);
  return (
    <>
      <div class="my-3 lg:my-3 container px-3 mx-auto flex border-gray-300">
        <div>
          <div class="text-xs breadcrumbs">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              {links.map((link, index) => (
                <li key={index}>{capitalizeFirstLetter(link)}</li>
              ))}
            </ul>
          </div>
          <h4 class="text-2xl w-1/2 font-bold leading-tight text-gray-800 dark:text-gray-100 pb-4 border-b">
            {pageTitle}
          </h4>
        </div>
      </div>
    </>
  );
});
