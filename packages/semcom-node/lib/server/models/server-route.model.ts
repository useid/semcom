import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

export interface ServerRoute {
    method: string;
    path: string;
    execute: (context: ParameterizedContext<DefaultState, DefaultContext>) => void;
}
