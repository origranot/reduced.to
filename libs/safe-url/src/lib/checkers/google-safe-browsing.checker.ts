import { Injectable } from '@nestjs/common';
import { Checker } from './checker';

@Injectable()
export class GoogleSafeBrowsingChecker extends Checker {
  constructor(private readonly apiKey: string) {
    super();
  }

  async isSafeUrl(url: string): Promise<boolean> {
    const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url }],
        },
      }),
    });

    const data = await response.json();
    return !data.matches;
  }
}
