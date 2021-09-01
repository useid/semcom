export class ComponentMetadata {

  [key: string]: string | number | boolean | string[] | undefined;

  constructor(
    public uri: string,
    public label: string,
    public description: string,
    public author: string,
    public tag: string,
    public version: string,
    public latest: boolean,
    public shapes: string[],
  ) {}

}
