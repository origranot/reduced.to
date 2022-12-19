import { createContext } from '@builder.io/qwik';
import { ThemePreference } from './components/theme-switcher/theme-switcher';
import { User } from './shared/auth.service';

export interface SiteStore {
  theme: ThemePreference | 'auto';
  user: User | null;
}

export const GlobalStore = createContext<SiteStore>('site-store');
