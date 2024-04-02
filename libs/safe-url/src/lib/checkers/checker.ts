export abstract class Checker {
  abstract isSafeUrl(url: string): Promise<boolean>;
}
