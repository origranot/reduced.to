/**
 * function to share on twitter
 * @param url - the reduced url link
 */
export function handleShareOnTwitter(url: string) {
  if (!url) return;

  const params = new URLSearchParams();
  params.set('text', encodeURIComponent('My URL has just been reduced! 🎉'));
  params.set('url', url);
  params.set('hashtags', 'reduced.to,shortenurl');

  const twitterUrl = `https://twitter.com/share?${params.toString()}`;
  window.open(twitterUrl, '', 'left=0,top=auto,width=550,height=450');
}
