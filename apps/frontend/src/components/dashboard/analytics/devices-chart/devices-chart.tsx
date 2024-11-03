import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik';
import { NoData } from '../../empty-data/no-data';
import { fetchAnalyticsChartData } from '../utils';
import styles from '../analytics-chart.css?inline';
import { icons } from './icons';
import { UNKNOWN_FAVICON_SMALL } from '../../../temporary-links/utils';

interface Device {
  field: string;
  count: number;
}

interface DevicesChartProps {
  urlKey: string;
  daysDuration: number;
  initialData: Device[];
}

export const DevicesChart = component$((props: DevicesChartProps) => {
  useStylesScoped$(styles);

  const selectedCategory = useSignal<'devices' | 'os' | 'browsers'>('devices');
  const devices = useSignal<Device[]>(props.initialData);

  useVisibleTask$(async ({ track }) => {
    track(() => selectedCategory.value);
    track(() => props.daysDuration);

    const data = await fetchAnalyticsChartData(props.urlKey, selectedCategory.value, props.daysDuration);
    devices.value = data;
  });

  return (
    <div class="relative z-0 h-[400px] dark:bg-slate-800 bg-white px-5 py-5 rounded-lg shadow overflow-hidden">
      <div class="mb-3 flex justify-between">
        <h1 class="text-lg font-semibold">Devices</h1>
        <div class="relative inline-flex items-center space-x-1">
          <button
            class={`btn btn-sm btn-ghost ${selectedCategory.value === 'devices' ? 'btn-active' : ''}`}
            onClick$={() => {
              selectedCategory.value = 'devices';
            }}
          >
            Type
          </button>
          <button
            class={`btn btn-sm btn-ghost ${selectedCategory.value === 'os' ? 'btn-active' : ''}`}
            onClick$={() => {
              selectedCategory.value = 'os';
            }}
          >
            OS
          </button>
          <button
            class={`btn btn-sm btn-ghost ${selectedCategory.value === 'browsers' ? 'btn-active' : ''}`}
            onClick$={() => {
              selectedCategory.value = 'browsers';
            }}
          >
            Browsers
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1 overflow-y-auto h-[300px] pb-4 scrollbar-hide relative">
        {devices.value.length === 0 ? (
          <div class="pt-12">
            <NoData title="No Data Available" description="No devices to display." />
          </div>
        ) : (
          devices.value.map((item) => (
            <div key={item.field} class="group flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-500/10">
              <div class="relative z-10 flex h-8 w-full max-w-[calc(100%-2rem)] items-center">
                <div class="z-10 flex items-center space-x-2 px-2">
                  <img alt={item.field} src={icons[item.field?.toLowerCase()] || UNKNOWN_FAVICON_SMALL} class="h-4 w-4" />
                  <div class="truncate text-sm text-gray-800 dark:text-gray-200 underline-offset-4 group-hover:underline">
                    {item.field || 'Other'}
                  </div>
                </div>
                <div
                  class="absolute h-full origin-left rounded-sm bg-orange-100 dark:bg-orange-500/30"
                  style={{ width: `${(item.count / devices.value[0].count) * 100}%`, transform: 'scaleX(1)' }}
                ></div>
              </div>
              <p class="z-10 px-2 text-sm text-gray-600 dark:text-gray-200">{item.count}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
});
