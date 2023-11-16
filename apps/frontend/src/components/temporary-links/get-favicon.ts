const UNKNOWN_FAVICON = '/images/unkown-favicon.png';

export const getFavicon = async (url: string) => {
  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${url}`;
  try {
    const response = await fetch(faviconUrl);
    console.log(response);
    return response.status === 200 ? faviconUrl : UNKNOWN_FAVICON;
  } catch (err) {
    return UNKNOWN_FAVICON;
  }
};
