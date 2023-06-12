import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AnalyticsService {
  public getDataFromRequest(req: Request) {
    return {
      //TIDO: Fix this (it's not working properly)
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    };
  }
}
