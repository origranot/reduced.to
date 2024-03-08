import { $, component$, useSignal, useId, Signal } from '@builder.io/qwik';
import { LuFilter } from '@qwikest/icons/lucide';

const filterList = [
  { label: 'By created at', value: 'createdAt' },
  { label: 'By expiration date', value: 'expirationTime' },
  { label: 'By name', value: 'name' },
  { label: 'By clicks', value: 'clicks' },
];
interface AdvancedFilterProps {
  callback: () => void;
  status: Signal<string>;
  compoundFilter: {
    createdAt: {
      min: string;
      max: string;
    };
    expirationTime: {
      min: string;
      max: string;
    };
    name: string;
    clicks: null | number;
  };
}

export const AdvancedFilter = component$<AdvancedFilterProps>(({ compoundFilter, callback, status }) => {
  const selectedFilters = useSignal<string[]>([]);

  return (
    <>
      {/* status toggle */}
      <div class="">
        <ul class="menu menu-vertical lg:menu-horizontal border input-bordered border-dashed rounded-btn p-1 items-center">
          <li class="menu-title font-normal text-base">Status</li>
          <li>
            <button
              onClick$={() => {
                status.value = 'active';
                callback();
              }}
              class={status.value === 'active' ? 'active' : ''}
            >
              Active
            </button>
          </li>
          <li class="ml-1">
            <button
              onClick$={() => {
                status.value = 'expired';
                callback();
              }}
              class={status.value === 'expired' ? 'active' : ''}
            >
              Expired
            </button>
          </li>
        </ul>
      </div>
      {/* Filter */}
      <div class="block mx-3">
        <div class="dropdown dropdown-hover">
          <button tabIndex={0} class="btn btn-outline border-dashed input-bordered flex items-center">
            <LuFilter class="w-4 h-4" />
            <p class="font-normal">Filter</p>
          </button>
          <div
            tabIndex={0}
            style={{ minWidth: selectedFilters.value.length ? '500px' : 'fit-content' }}
            class="p-2 shadow-lg menu menu-compact dropdown-content bg-base-100 rounded-box max-w-2xl"
          >
            <div class="w-full flex gap-2 divide-x-2">
              <ul>
                {filterList.map(({ label, value }) => (
                  <li key={value}>
                    <label for={value} class="">
                      <input
                        type="checkbox"
                        onInput$={({ target }) =>
                          (target as HTMLInputElement).checked
                            ? (selectedFilters.value = [...selectedFilters.value, value])
                            : (selectedFilters.value = [...selectedFilters.value.filter((v) => v !== value)])
                        }
                        id={value}
                        checked={selectedFilters.value.includes(value)}
                        class="checkbox checkbox-xs"
                      />
                      <span class="whitespace-nowrap">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {selectedFilters.value.length > 0 && (
                <div class="w-full flex flex-col gap-2 pl-2">
                  <div class="flex-1 space-y-2">
                    {selectedFilters.value.includes('createdAt') && (
                      <DateFilter
                        min={compoundFilter.createdAt.min}
                        max={compoundFilter.createdAt.max}
                        onMin={$((ev: InputEvent) => {
                          const dateString = (ev.target as HTMLInputElement).value;
                          compoundFilter.createdAt.min = dateString;
                          callback();
                        })}
                        onMax={$((ev: InputEvent) => {
                          const dateString = (ev.target as HTMLInputElement).value;
                          compoundFilter.createdAt.max = dateString;
                          callback();
                        })}
                      />
                    )}
                    {selectedFilters.value.includes('expirationTime') && (
                      <DateFilter
                        min={compoundFilter.expirationTime.min}
                        max={compoundFilter.expirationTime.max}
                        onMin={$((ev: InputEvent) => {
                          const dateString = (ev.target as HTMLInputElement).value;
                          compoundFilter.expirationTime.min = dateString;
                          callback();
                        })}
                        onMax={$((ev: InputEvent) => {
                          const dateString = (ev.target as HTMLInputElement).value;
                          compoundFilter.expirationTime.max = dateString;
                          callback();
                        })}
                      />
                    )}
                    {selectedFilters.value.includes('name') && <NameFilter />}
                    {selectedFilters.value.includes('clicks') && <ClicksFilter />}
                  </div>
                  <div class="flex items-center justify-end border-t pt-2">
                    <button
                      onClick$={$(() => {
                        selectedFilters.value = [];
                        compoundFilter.createdAt.min = '';
                        compoundFilter.createdAt.max = '';
                        compoundFilter.expirationTime.min = '';
                        compoundFilter.expirationTime.max = '';
                        callback();
                      })}
                      class="btn btn-ghost btn-xs"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

interface DateFilter {
  min: string;
  max: string;
  onMin: (ev: InputEvent) => void;
  onMax: (ev: InputEvent) => void;
}

const DateFilter = component$(({ max, min, onMax, onMin }: DateFilter) => {
  const id = useId();
  return (
    <div class="w-full p-2 flex gap-1 flex-col rounded-lg bg-slate-100 dark:bg-dark-modal">
      <label for={'minDate' + id} class="flex items-center">
        Min:
        <input
          name={'minDate' + id}
          id={'minDate' + id}
          type="date"
          value={min}
          // max={tomorrow().toISOString().split('T')[0]}
          onChange$={(ev: InputEvent) => onMin(ev)}
          class="ml-2 input input-bordered input-sm flex-1"
        />
      </label>
      <label for={'maxDate' + id} class="flex items-center">
        Max:
        <input
          name={'maxDate' + id}
          id={'maxDate' + id}
          type="date"
          value={max}
          onChange$={(ev: InputEvent) => onMax(ev)}
          class="ml-2 input input-bordered input-sm flex-1"
        />
      </label>
    </div>
  );
});

const NameFilter = () => {
  return (
    <div class="w-full text-left p-1.5 rounded-lg bg-slate-100 dark:bg-dark-modal">
      <p class="text-slate-500">
        Filter by name <span class="badge badge-primary badge-xs animate-pulse">Soon</span>
      </p>
    </div>
  );
};

const ClicksFilter = () => {
  return (
    <div class="w-full text-left p-1.5 rounded-lg bg-slate-100 dark:bg-dark-modal">
      <p class="text-slate-500">
        Filter by clicks <span class="badge badge-primary badge-xs animate-pulse">Soon</span>
      </p>
    </div>
  );
};
