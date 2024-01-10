import { component$, useStylesScoped$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Chart, registerables } from 'chart.js';
import { RequestHandler } from '@builder.io/qwik-city';

const UNKNOWN_URL = '/unknown';

const isValidUrl = (urlId: string) => {
  return urlId && urlId.split('/')[0] !== UNKNOWN_URL.substring(1) && urlId !== 'null';
};

export const onGet: RequestHandler = async ({ params: { urlId }, redirect, clientConn, request, next }) => {
  if (!isValidUrl(urlId)) {
    throw redirect(302, UNKNOWN_URL);
  }

  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}`, {
      headers: {
        'x-forwarded-for': clientConn.ip || '',
        'user-agent': request.headers.get('user-agent') || '',
      },
    });
    console.log(await res.text());
    const url = `/stats/${urlId}`;

    if (res.status !== 200 || !url) {
      throw new Error('failed to fetch original url...');
    }
  } catch (err) {
    throw redirect(302, UNKNOWN_URL);
  }

  next();
};

const fetchVisitData = async (urlId: string) => {
  try {
    const res = await fetch(`${process.env.API_DOMAIN}/api/v1/shortener/${urlId}/visits`);
    const visitData = await res.json();
    return visitData;
  } catch (error) {
    console.error('Error fetching visit data:', error);
    return null;
  }
};

export default component$(() => {
  const countryChart = useSignal<HTMLCanvasElement>();
  const deviceChart = useSignal<HTMLCanvasElement>();
  const historyClicksChart = useSignal<HTMLCanvasElement>();

  useVisibleTask$(() => {
    if (countryChart?.value) {
      Chart.register(...registerables);
      new Chart(countryChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Israel', 'Singapore', 'USA', 'Germany'],
          datasets: [
            {
              label: '# of votes',
              data: [12, 19, 3, 5],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'The Locations of the clicks',
            },
          },
          responsive: true,
        },
      });
    }
    if (deviceChart?.value) {
      Chart.register(...registerables);
      new Chart(deviceChart.value, {
        type: 'pie',
        data: {
          labels: ['Windows', 'Mac', 'iPhone', 'Android'],
          datasets: [
            {
              label: '#',
              data: [10, 5, 15, 2],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Devices that has visited your URL',
            },
          },
          responsive: true,
        },
      });
    }
    if (historyClicksChart?.value) {
      Chart.register(...registerables);
      new Chart(historyClicksChart.value, {
        type: 'line',
        data: {
          labels: ['1st Week of Jan', '2nd Week of Jan', '3rd Week of Jan', '4th Week of Jan'],
          datasets: [
            {
              label: '#',
              data: [10, 5, 15, 2],
              borderWidth: 1,
              pointStyle: 'circle',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: '#ffd0da',
              pointRadius: 10,
              pointHoverRadius: 15,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Amount of visitors per week',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          responsive: true,
        },
      });
    }
  });

  return (
    <section class="flex flex-col h-[calc(100vh-64px)]">
      <div class="relative before:absolute before:top-0 before:start-1/2 before:bg-[url('assets/svg/hero/polygon-bg-element-light.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:w-full before:h-full before:-z-[1] before:transform before:-translate-x-1/2 dark:before:bg-[url('assets/svg/hero/polygon-bg-element-dark.svg')]">
        <div class="grow container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div class="max-w-md text-center mb-8">
            <h2 class="mb-8 font-extrabold text-6xl text-gray-600 dark:text-gray-300">In Summary:</h2>
            <ul class="flex list-disc list-inside">
              <li class="ml-0 text-green-500">
                <span class="text-black dark:text-white">1 URL</span>
              </li>
              <li class="ml-8 text-blue-500">
                <span class="text-black dark:text-white">0 Clicks</span>
              </li>
              <li class="ml-8 text-yellow-500">
                <span class="text-black dark:text-white">0 Locations</span>
              </li>
              <li class="ml-8 text-red-500">
                <span class="text-black dark:text-white">0 Devices</span>
              </li>
            </ul>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
          <div style="width: 40%; padding: 32px;">
            <canvas ref={countryChart} id="countryChart"></canvas>
          </div>
          <div style="width: 40%; padding: 32px;">
            <canvas ref={deviceChart} id="deviceChart"></canvas>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
          <div style="width: 50%;">
            <canvas ref={historyClicksChart} id="historyClicksChart"></canvas>
          </div>
        </div>
      </div>
    </section>
  );
});
