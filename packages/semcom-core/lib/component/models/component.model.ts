import { ComponentDataTypes } from './component-data-types';

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
  readData<D extends keyof ComponentDataTypes>(uri: string, type: D): void;

  /**
   * Should send a `ComponentWriteEvent` to the component's parent to write data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be written to the resource.
   */
  writeData<D extends keyof ComponentDataTypes>(uri: string, data: ComponentDataTypes[D], type: D): void;

  /**
   * Should send a `ComponentAppendEvent` to the component's parent to append data to a given resource.
   *
   * @param uri The uri of the resource to read.
   * @param data The data which should be appended to the resource.
   */
  appendData<D extends keyof ComponentDataTypes>(uri: string, data: ComponentDataTypes[D], type: D): void;
}
