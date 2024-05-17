export const UNKNOWN_FAVICON = '/images/unkown-favicon.png';
export const UNKNOWN_FAVICON_SMALL = '/images/unkown-favicon-small.png';

export const getFavicon = async (url: string) => {
  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${url}`;
  try {
    const response = await fetch(faviconUrl);
    return response.status === 200 ? faviconUrl : UNKNOWN_FAVICON;
  } catch (err) {
    return UNKNOWN_FAVICON;
  }
};

export const getLinkFromKey = (key: string) => {
  const suffix = `${process.env.DOMAIN}/${key}`;

  // This is a temporary solution until we have a better way to handle this, maybe use env file? 🤔
  if (process.env.DOMAIN === 'localhost') {
    return `http://${process.env.DOMAIN}:4200/${key}`;
  }

  return `https://${suffix}`;
};
