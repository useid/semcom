export interface ServerResponse {
    body: any;
    headers: { [key: string]: string };
    status: number;
}
