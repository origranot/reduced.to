import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * The default export is the QwikCity adaptor used by Vite preview.
 */
export default createQwikCity({ render, qwikCityPlan });
