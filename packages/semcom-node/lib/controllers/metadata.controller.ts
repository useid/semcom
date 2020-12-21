import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

export class MetadataController {

  public all(context: ParameterizedContext<DefaultState, DefaultContext>): void {
    context.body = 'Hello world';
    context.status = 200;
  }
}
