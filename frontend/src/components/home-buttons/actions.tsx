/**
 * function to share on twitter
 * @param url - the reduced url link
 * @returns
 */
export function handleShareOnTwitter(url: string) {
  if (!url) return;

  const text = `${encodeURIComponent('My url has just reduced!\nCheck out:')}`;
  const hashtags = 'reducedto,shortenurl';

  const twitterUrl = `https://twitter.com/share?text=${text} &url=${url} &hashtags=${hashtags}`;
  window.open(twitterUrl, '', 'left=0,top=auto,width=550,height=450');
}
