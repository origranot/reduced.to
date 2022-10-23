interface ISocialMediaObjectKeys {
  [key: string]: string | undefined;
}

export interface ISocialMedia extends ISocialMediaObjectKeys {
  url: string
  text?: string
  via?: string
  hashtags?: string
}
