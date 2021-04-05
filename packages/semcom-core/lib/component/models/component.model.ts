
export interface Component extends HTMLElement {
  data (
    entry: string,
    customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  ): Promise<void>
}
