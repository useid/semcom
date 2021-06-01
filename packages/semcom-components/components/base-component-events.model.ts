import * as N3 from 'n3';

export enum BaseComponentEvent {
  READ = 'semcom-data-read',
  WRITE = 'semcom-data-write',
  APPEND = 'semcom-data-append',
  RESPONSE = 'semcom-data-response',
}

export class ReadEvent extends CustomEvent<{ uri: string }> {

  constructor(init: Partial<CustomEventInit<{ uri: string }>>) {

    super(BaseComponentEvent.READ, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

export class WriteEvent extends CustomEvent<{ uri: string }> {

  constructor(init: Partial<CustomEventInit<{ uri: string }>>) {

    super(BaseComponentEvent.WRITE, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

export class AppendEvent extends CustomEvent<{ uri: string }> {

  constructor(init: Partial<CustomEventInit<{ uri: string }>>) {

    super(BaseComponentEvent.APPEND, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}

export class ResponseEvent extends CustomEvent<{ quads: N3.Quad[] }> {

  constructor(init: Partial<CustomEventInit<{ quads: N3.Quad[] }>>) {

    super(BaseComponentEvent.RESPONSE, {
      ...{
        bubbles: true,
        composed: true,
      },
      ...init,
    });

  }

}
