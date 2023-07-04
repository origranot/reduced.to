export type ResponseBody = {
  status: number;
  headers?: Record<string, any>;
  contentType?: 'application/json';
  body?: string;
};

export type MockResponse = Record<string, ResponseBody>;
