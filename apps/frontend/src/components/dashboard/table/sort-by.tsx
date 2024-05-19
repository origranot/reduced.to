import { component$ } from '@builder.io/qwik';
import { SortOrder } from './table-server-pagination';
import { LuArrowDown, LuArrowUp } from '@qwikest/icons/lucide';

export enum LinkAttribute {
  URL = 'url',
  Clicks = 'clicks',
  CreatedAt = 'createdAt',
  ExpirationTime = 'expirationTime',
}

export interface ISortBy {
  attribute: LinkAttribute;
  order: SortOrder;
}

export interface SortByProps {
  sortBy: ISortBy;
  onChangeAttribute: (e: Event) => void;
  toggleOrder: () => void;
}

export const SortBy = component$<SortByProps>(({ sortBy, onChangeAttribute, toggleOrder }) => {
  return (
    <div class="flex items-center gap-2 mb-2">
      <select
        value={sortBy.attribute}
        onChange$={(e) => onChangeAttribute(e)}
        class="input input-bordered cursor-pointer h-12 pr-0 bg-base-100"
      >
        <option value={0} selected disabled hidden>
          Sort By
        </option>
        <option value={LinkAttribute.URL}>URL</option>
        <option value={LinkAttribute.Clicks}>Clicks</option>
        <option value={LinkAttribute.CreatedAt}>Created At</option>
        <option value={LinkAttribute.ExpirationTime}>Expiration Time</option>
      </select>
      <button onClick$={() => toggleOrder()}>{sortBy.order === SortOrder.ASC ? <LuArrowUp /> : <LuArrowDown />}</button>
    </div>
  );
});
