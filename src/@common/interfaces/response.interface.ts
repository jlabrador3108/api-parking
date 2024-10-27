import { HttpStatus } from '@nestjs/common';

export interface ResponseData<T = any> {
  statusCode?: number;
  data?: T;
  message?: string;
}

const DEFAULT_OPTIONS = {
  data: undefined,
  message: undefined,
  statusCode: HttpStatus.OK,
};

export function ResponseMessage<T>(options: ResponseData<T>) {
  return { ...DEFAULT_OPTIONS, ...options };
}
