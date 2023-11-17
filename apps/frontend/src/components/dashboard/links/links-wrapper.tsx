import { PropFunction, component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { authorizedFetch } from '../../../shared/auth.service';
import { PaginationFetcher, PaginationParams, ResponseData, serializeQueryUserPaginationParams } from '../table/table-server-pagination';
import { ILink, LinkBlock } from './link';
import { QrCodeDialog } from '../../temporary-links/qr-code-dialog/qr-code-dialog';

export const LinksWrapper = component$(() => {
  const filter = useSignal('');
  const limit = useSignal(10);
  const currentPage = useSignal(1);
  const linksData = useSignal<ResponseData>({ total: 0, data: [] });
  const maxPages = useSignal(0);
  const interactedLink = useSignal<ILink | null>(null);

  const isOnFirstPage = useSignal(true);
  const isOnLastPage = useSignal(true);

  const isLoading = useSignal(true);

  const fetchLinks: PropFunction<PaginationFetcher> = $(async (paginationParams: PaginationParams) => {
    const queryParams = serializeQueryUserPaginationParams(paginationParams);
    const data = await authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links?${queryParams}`);
    const response = (await data.json()) as ResponseData;
    if (!response || !response.data) {
      console.warn('Server response is not valid', response);

      response.total = 0;
      response.data = [];
    }

    return response;
  });

  const onFilterInputChange = $(async (ev: InputEvent) => {
    filter.value = (ev.target as HTMLInputElement).value;
    currentPage.value = 1;
  });

  useVisibleTask$(async ({ track }) => {
    track(() => currentPage.value);
    track(() => limit.value);
    track(() => filter.value);

    // Fetch data
    const result = await fetchLinks({
      page: currentPage.value,
      limit: limit.value,
      filter: filter.value,
      sort: {},
    });

    linksData.value = result;
    maxPages.value = Math.ceil(result.total / limit.value || 1);

    // Update isOnFirstPage and isOnLastPage
    isOnFirstPage.value = currentPage.value === 1;
    isOnLastPage.value = currentPage.value >= maxPages.value;

    isLoading.value = false;
  });

  return (
    <>
      <div class="flex">
        <div class="filter-container">
          <h3>Filters</h3>
          <label for="filterInput">Filter by:</label>
          <input id="filterInput" type="text" onInput$={onFilterInputChange} value={filter.value} />
        </div>
        <ul>
          {linksData.value.data.map((link: any, index) => {
            console.log(link.key);
            return <LinkBlock urlKey={link.key} url={link.url} favicon={link.favicon} interactedLink={interactedLink} />;
          })}
        </ul>
      </div>
      <QrCodeDialog link={{key: interactedLink.value?.urlKey!}} />
    </>
  );
});
