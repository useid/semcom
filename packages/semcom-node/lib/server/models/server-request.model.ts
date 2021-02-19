export interface ServerRequest {
  headers: { [key: string]: string };
  method: string;
  body?: any;
}
