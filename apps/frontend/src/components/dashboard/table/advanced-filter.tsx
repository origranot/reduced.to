import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { LuFilter } from '@qwikest/icons/lucide';
import { tomorrow } from '../../../lib/date-utils';

const filterList = [
  { label: 'By created at', value: 'createdAt' },
  { label: 'By expiration date', value: 'expirationDate' },
  { label: 'By name', value: 'name' },
  { label: 'By clicks', value: 'clicks' },
];

// const sortList = [
//   { label: 'By created at', value: 'createdAt' },
//   { label: 'By expiration date', value: 'expirationDate' },
//   { label: 'By name', value: 'name' },
//   { label: 'By clicks', value: 'clicks' },
// ];

export const AdvancedFilter = component$(() => {
  const selectedFilters = useSignal<string[]>([]);

  //   useTask$(({ track }) => {
  //     const v = track(selectedFilters);
  //     console.log(v);
  //   });

  return (
    <>
      {/* Filter */}
      <div class="block mr-3">
        <div class="dropdown dropdown-hover">
          <button tabIndex={0} class="btn btn-outline input-bordered flex items-center">
            <LuFilter class="w-4 h-4" />
            <p class="font-normal">Filter</p>
          </button>
          <div
            tabIndex={0}
            style={{ minWidth: selectedFilters.value.length ? '500px' : 'fit-content' }}
            class="p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box max-w-2xl"
          >
            <div class="w-full flex gap-2 divide-x-2">
              <ul>
                {filterList.map(({ label, value }) => (
                  <li key={value}>
                    <label for={value} class="">
                      <input
                        type="checkbox"
                        // onInput$={
                        //   ({ target }) => null
                        //   // (target as HTMLInputElement).checked ? (selectedFilters.value = [...selectedFilters.value, value]) : ''
                        //   // : (selectedFilters.value = [...selectedFilters.value.filter((v) => v === value)])
                        // }
                        id={value}
                        class="checkbox checkbox-xs"
                      />
                      <span class="whitespace-nowrap">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {/* {selectedFilters.value && (
                <div class="w-full flex flex-col gap-2 pl-2">
                  <div class="flex-1">
                     {selectedFilters.value.includes('createdAt') && <CreatedAtFilter />} 
                    {selectedFilters.value.includes('expirationDate') && <ExpirationDateFilter />}
                    {selectedFilters.value.includes('name') && <NameFilter />}
                    {selectedFilters.value.includes('clicks') && <ClicksFilter />} 
                  </div>
                  <div class="flex items-center justify-end border-t pt-2">
                    <button onClick$={(selectedFilters.value = [])} class="btn btn-ghost btn-xs">
                      Clear
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      {/* Sort
      <div class="block">
        <div class="dropdown dropdown-hover">
          <button tabIndex={0} class="btn btn-outline input-bordered flex items-center">
            <LuArrowDownUp class="w-4 h-4" />
            <p class="font-normal">Sort</p>
          </button>
          <ul tabIndex={0} class="p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48">
            {sortList.map(({ label, value }) => (
              <li key={value}>
                <label for={value} class="">
                  <input type="checkbox" id={value} class="checkbox checkbox-xs" />
                  <span class="">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div> 
      </div>
        */}
    </>
  );
});

const CreatedAtFilter = () => {
  return (
    <div class="w-full flex items-center gap-2">
      <input name="createdAt" type="date" max={tomorrow().toISOString().split('T')[0]} class="input input-bordered input-sm w-full" />
      {/* <input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /> */}
      {/* <select class="select select-bordered w-full max-w-xs select-sm">
        <option disabled selected>
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select> */}
    </div>
  );
};

const ExpirationDateFilter = () => {
  return (
    <div class="w-full flex items-center gap-2">
      <input name="expirationTime" type="date" class="input input-bordered input-sm w-full" />
      {/* <input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" /> */}
      {/* <select class="select select-bordered w-full max-w-xs select-sm">
        <option disabled selected>
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select> */}
    </div>
  );
};

const NameFilter = () => {
  return (
    <div class="w-full flex items-center gap-2">
      {/* <input name="expirationTime" type="date" min={tomorrow().toISOString().split('T')[0]} class="input input-bordered input-sm w-full" /> */}
      <input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" />
      {/* <select class="select select-bordered w-full max-w-xs select-sm">
        <option disabled selected>
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select> */}
    </div>
  );
};

const ClicksFilter = () => {
  return (
    <div class="w-full flex items-center gap-2">
      {/* <input name="expirationTime" type="date" min={tomorrow().toISOString().split('T')[0]} class="input input-bordered input-sm w-full" /> */}
      <input type="text" placeholder="Type here" class="input input-sm input-bordered w-full max-w-xs" />
      {/* <select class="select select-bordered w-full max-w-xs select-sm">
        <option disabled selected>
          Who shot first?
        </option>
        <option>Han Solo</option>
        <option>Greedo</option>
      </select> */}
    </div>
  );
};
