import { Injectable } from '@nestjs/common';
import { parse } from 'node-html-parser';
import { hostname } from 'os';

export interface Metadata {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  hostname: string | null;
}

const emptyMetadata: Metadata = {
  title: null,
  description: null,
  image: null,
  url: null,
  hostname: null,
};

@Injectable()
export class MetadataService {
  async fetch(urlString: string): Promise<Metadata> {
    try {
      if (!urlString) {
        return emptyMetadata;
      }

      const url = new URL(urlString);
      const response = await fetch(url);
      const html = await response.text();
      const root = parse(html);

      const title =
        root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        root.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
        root.querySelector('title')?.text ||
        '';

      const description =
        root.querySelector('meta[name="description"]')?.getAttribute('content') ||
        root.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        root.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
        '';

      const image =
        root.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        root.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
        root.querySelector('link[rel="image_src"]')?.getAttribute('href') ||
        root.querySelector('link[rel="icon"]')?.getAttribute('href') ||
        root.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
        '';

      return { title, description, image, url: urlString, hostname: url.hostname };
    } catch (error) {
      return emptyMetadata;
    }
  }

  private isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };
}
