export const getDomainNameFromUrl = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\.(?:[a-zA-Z]{2,})(?:\/|$)/;
  const match = url.match(regex);
  if (match) {
    return match[1]; // Extracted domain name
  } else {
    return url;
  }
};
