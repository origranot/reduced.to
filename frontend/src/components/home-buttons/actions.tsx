import { ITwitter } from './types/social-media';

/**
 * function to share on twitter
 * @param twitterData 
 * @returns 
*/
export function handleShareOnTwitter (twitterData?:ITwitter){
  const shorten_url = document.querySelector('#result #text')!.textContent;
  if(!shorten_url) return
  let base_url = `https://twitter.com/share?`;
  const params:ITwitter = twitterData ? twitterData  : {
    text: `${encodeURIComponent('My url has just reduced!\nCheck out:')}`,
    url: shorten_url ,
    hashtags: "reducedto,shortenurl",
  }
  base_url += `text=${params.text} &url=${params.url} &hashtags=${params.hashtags} &via=${params.via}`
  window.open(base_url, '', 'left=0,top=auto,width=550,height=450');
}