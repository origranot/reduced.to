import { component$, useVisibleTask$ } from '@builder.io/qwik';

export interface LinkBlockProps {
  urlKey: string;
  url: string;
  favicon?: string;
}

export const LinkBlock = component$((props: LinkBlockProps) => {
  useVisibleTask$(() => {
    console.log(props, 'props');
  });
  return (
    <>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="mr-3">
            <img src={props.favicon || `https://www.google.com/s2/favicons?sz=64&domain_url=${props.url}`} class="w-8 h-8 rounded-full" />
          </div>
          <div class="flex flex-col text-left">
            <div class="text-sm font-medium">{props.url}</div>
            <div class="text-xs font-medium text-gray-500">{props.urlKey}</div>
          </div>
        </div>
        <div class="flex items-center">

        </div>
      </div>
    </>
  );
});
