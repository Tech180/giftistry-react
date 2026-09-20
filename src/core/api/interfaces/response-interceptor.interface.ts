export type ResponseInterceptor = (
  response: Response,
  json: unknown
) => void | Promise<void>;
