import { component$, useStylesScoped$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { formatDate } from '../../lib/date-utils';
import animations from '../../assets/css/animations.css?inline';
import { Chart, registerables } from 'chart.js';

export default component$(() => {
  useStylesScoped$(animations);
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
        type: 'bar', // Change the chart type if needed
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
          scales: {
            y: {
              beginAtZero: true,
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
              text: 'Devices that has visited your URL',
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
          <div style="width: 50%; padding: 32px;">
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
