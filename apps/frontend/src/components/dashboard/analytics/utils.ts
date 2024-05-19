import { authorizedFetch } from '../../../shared/auth.service';

export const fetchAnalyticsChartData = async (key: string, category: string, days: number) => {
  try {
    const response = await authorizedFetch(`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/analytics/${key}/${category}?days=${days}`);
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error(`Could not fetch ${category} chart data`, err);
    return [];
  }
};
