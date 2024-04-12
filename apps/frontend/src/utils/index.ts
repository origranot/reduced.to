export const copyToClipboard = async (data: string): Promise<void> => {
  return navigator.clipboard.writeText(data);
};

export const openUrl = (url: string | URL, target = '_blank'): void => {
  window.open(url, target);
};

/**
 * Normalize url input
 *  - add protocol 'http' if missing.
 *  - correct protocol http/https if mistyped one character.
 * @param {string} url
 * @returns {string} Normalized url
 */
export const normalizeUrl = (url: string): string => {
  const regexBadPrefix = new RegExp(/^(:\/*|\/+|https:\/*)/); // Check if starts with  ':', '/' and 'https:example.com' etc.
  const regexBadPrefixHttp = new RegExp(/^http:\/*/); // Check if 'http:example.com', 'http:/example.com' etc.
  const regexProtocolExists = new RegExp(/^(.+:\/\/|[^a-zA-Z])/); // Check if starts with '*://' or special chars.
  const regexMistypedHttp = new RegExp(/^([^hH][tT][tT][pP]|[hH][^tT][tT][pP]|[hH][tT][^tT][pP]|[hH][tT][tT][^pP])/);

  url = url.replace(regexMistypedHttp, 'http').replace(regexBadPrefix, 'https://').replace(regexBadPrefixHttp, 'http://');

  return (regexProtocolExists.test(url) ? '' : 'https://') + url;
};


export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
