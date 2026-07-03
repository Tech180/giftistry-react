export type ResponseInterceptor = (response: Response, json: any) => void | Promise<void>;
