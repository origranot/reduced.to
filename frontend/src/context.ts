import { createContextId } from '@builder.io/qwik';
import { ThemePreference } from './components/theme-switcher/theme-switcher';

export interface SiteStore {
  theme: ThemePreference | 'auto';
  user: {
    name: string;
    email: string;
    verified: boolean;
    role: 'USER' | 'ADMIN';
  } | null;
}

export const GlobalStore = createContextId<SiteStore>('site-store');
