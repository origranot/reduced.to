import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { serverSideFetch } from '../../../../shared/auth.service';
import { component$, useSignal } from '@builder.io/qwik';
import { ClicksChart } from '../../../../components/dashboard/analytics/clicks-chart/clicks-chart';

export const useGetAnalytics = routeLoader$(async ({ params: { key }, cookie, redirect }) => {
  const res = await serverSideFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/analytics/${key}?days=7`, cookie);

  if (res.status !== 200) {
    throw redirect(302, '/unknown');
  }

  const data = await res.json();
  return {
    key,
    data,
  };
});

export default component$(() => {
  const daysDuration = useSignal(7);
  const analytics = useGetAnalytics();

  return (
    <>
      <div class="flex justify-between items-start mb-4">
        <div class="text-left w-3/4">
          <h1 class="text-xl font-semibold">Analytics Dashboard</h1>
          <p class="sm:block hidden">
            Track click-through rates, geographic locations, referral sources, and more for your short links. Data shown here are presented
            in Coordinated Universal Time (UTC).
          </p>
        </div>
        <div class="flex my-auto">
          <select
            class="select select-bordered max-w-xs"
            value={daysDuration.value}
            onChange$={(event) => {
              daysDuration.value = parseInt((event.target as HTMLSelectElement).value, 10);
            }}
          >
            <option value={1}>Last 24 hours</option>
            <option selected value={7}>
              Last 7 days
            </option>
            <option value={30}>Last 30 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>
      <ClicksChart
        urlKey={analytics.value.key}
        daysDuration={daysDuration.value}
        initialData={analytics.value.data.clicksOverTime}
        url={analytics.value.data.url}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Analytics',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Dashboard - Analytics',
    },
    {
      name: 'description',
      content: 'Reduced.to | Analytics page. See live analytics of your links!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard/analytics',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Dashboard - Analytics',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Analytics page. See live analytics of your links!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Dashboard - Analytics',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Analytics page. See live analytics of your links!',
    },
  ],
};
