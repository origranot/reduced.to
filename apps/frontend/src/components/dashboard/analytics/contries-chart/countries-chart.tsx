import { component$, useSignal, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik';
import { NoData } from '../../empty-data/no-data';
import countryLookup from 'country-code-lookup';
import styles from '../analytics-chart.css?inline';
import { fetchAnalyticsChartData } from '../utils';

interface Location {
  field: string;
  country?: string;
  count: number;
}

interface CountriesChartProps {
  urlKey: string;
  daysDuration: number;
  initialData: Location[];
}

export const CountriesChart = component$((props: CountriesChartProps) => {
  useStylesScoped$(styles);

  const selectedCategory = useSignal<'countries' | 'cities'>('countries');
  const searchQuery = useSignal('');
  const locations = useSignal<Location[]>(props.initialData);
  const isLoading = useSignal(false);

  useVisibleTask$(async ({ track }) => {
    track(() => selectedCategory.value);
    track(() => props.daysDuration);

    isLoading.value = true;
    const data = await fetchAnalyticsChartData(props.urlKey, selectedCategory.value, props.daysDuration);
    locations.value = data;
    isLoading.value = false;
  });

  const getCountryCode = (item: Location) => {
    return item.country ? item.country : item.field;
  };

  const filteredData = locations.value.filter((item) => {
    const country = countryLookup.byIso(getCountryCode(item));
    return country && country.country.toLowerCase().includes(searchQuery.value.toLowerCase());
  });

  return (
    <div class="relative z-0 h-[400px] dark:bg-slate-800 bg-white px-5 py-5 rounded-lg shadow overflow-hidden">
      <div class="mb-3 flex justify-between">
        <h1 class="text-lg font-semibold">Locations</h1>
        <div class="relative inline-flex items-center space-x-1">
          <button
            class={`btn btn-sm btn-ghost ${selectedCategory.value === 'countries' ? 'btn-active' : ''}`}
            onClick$={() => {
              selectedCategory.value = 'countries';
            }}
          >
            Countries
          </button>
          <button
            class={`btn btn-sm btn-ghost ${selectedCategory.value === 'cities' ? 'btn-active' : ''}`}
            onClick$={() => {
              selectedCategory.value = 'cities';
            }}
          >
            Cities
          </button>
        </div>
      </div>
      {/* Need to think about how to design this input field */}
      {/* <input
        type="text"
        placeholder="Search country..."
        class="input input-bordered w-full mb-3"
        onInput$={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
      /> */}

      {isLoading.value ? (
        <div class="flex items-center justify-center h-[300px]">
          <span class="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div class="flex flex-col gap-1 overflow-y-auto h-[300px] pb-4 scrollbar-hide relative">
          {filteredData.length === 0 ? (
            <div class="pt-12">
              <NoData title="No Data Available" description="No locations to display." />
            </div>
          ) : (
            filteredData.map((item) => {
              const countryCode = getCountryCode(item);
              const country = countryLookup.byIso(countryCode);
              const displayName = selectedCategory.value === 'cities' ? item.field : country?.country;
              return (
                <div key={item.field} class="group flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-500/10">
                  <div class="relative z-10 flex h-8 w-full max-w-[calc(100%-2rem)] items-center">
                    <div class="z-10 flex items-center space-x-2 px-2">
                      <img alt={countryCode} src={`https://flag.vercel.app/m/${countryCode}.svg`} class="h-3 w-5" />
                      <div class="truncate text-sm text-gray-800 dark:text-gray-200 underline-offset-4 group-hover:underline">
                        {displayName}
                      </div>
                    </div>
                    <div
                      class="absolute h-full origin-left rounded-sm bg-green-100 dark:bg-green-500/30"
                      style={{ width: `${(item.count / filteredData[0].count) * 100}%`, transform: 'scaleX(1)' }}
                    ></div>
                  </div>
                  <p class="z-10 px-2 text-sm text-gray-600 dark:text-gray-200">{item.count}</p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
});
