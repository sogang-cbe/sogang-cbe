import { about } from './pages-about';
import { undergraduate } from './pages-ug';
import { graduate } from './pages-grad';
import { alumni, policy } from './pages-misc';
import type { PageContent } from './types';
export const staticPages: Record<string, PageContent> = { ...about, ...undergraduate, ...graduate, ...alumni, ...policy };
