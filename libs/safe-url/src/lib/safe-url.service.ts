import { Inject, Injectable } from '@nestjs/common';
import { Checker } from './checkers/checker';

@Injectable()
export class SafeUrlService {
  constructor(@Inject('CHECKERS') private readonly checkers: Checker[]) {}

  async isSafeUrl(url: string): Promise<boolean> {
    const results = await Promise.all(this.checkers.map((checker) => checker.isSafeUrl(url)));
    // It should return true only if all checkers return true
    return results.every((isSafe) => isSafe);
  }
}
