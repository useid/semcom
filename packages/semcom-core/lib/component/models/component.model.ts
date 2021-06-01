export interface Component extends HTMLElement {
  read(uri: string): void;
  write(uri: string): void;
  append(uri: string): void;
}
