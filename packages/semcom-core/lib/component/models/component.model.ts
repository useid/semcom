import { Quad } from 'rdf-js';

/**
 * Definition of a web component which complies to the Semcom-standard.
 */
export interface Component extends HTMLElement {
  /**
   * The component's entry into its data.
   */
  entry?: string;

  /**
   * Should send a `ComponentReadEvent` to the component's parent to request data of a given resource.
   *
   * @param uri The uri of the resource to read.
   */
  readData(uri: string): void;

  /**
   * Should send a `ComponentWriteEvent` to the component's parent to write data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be written to the resource.
   */
  writeData(uri: string, data: Quad[]): void;

  /**
   * Should send a `ComponentAppendEvent` to the component's parent to append data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be appended to the resource.
   */
  appendData(uri: string, data: Quad[]): void;
}
