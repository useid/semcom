import { SequenceHandler } from '@digita-ai/handlersjs-core';
import { NodeHttpServer, NodeHttpRequestResponseHandler, RoutedHttpRequestHandler } from '@digita-ai/handlersjs-http';
import { defaultContentNegotiationHttpHandler, defaultComponentHttpHandler, defaultQueryComponentHttpHandler } from './handlers.js';

export const defaultComponentsRoute = {
  operations: [
    { method: 'GET', publish: true },
    { method: 'POST', publish: true },
  ],
  handler: defaultComponentHttpHandler,
  path: '/component',
};

export const defaultQueryComponentsRoute = {
  operations: [
    { method: 'POST', publish: true },
  ],
  handler: defaultQueryComponentHttpHandler,
  path: '/component/query',
};

export const defaultHttpHandlerController = {
  label: 'ControllerList',
  routes: [
    defaultComponentsRoute,
    defaultQueryComponentsRoute,
  ],
};

export const defaultRoutedHttpRequestHandler = new RoutedHttpRequestHandler([ defaultHttpHandlerController ]);

export const defaultNodeHttpRequestResponseHandler = new NodeHttpRequestResponseHandler(
  new SequenceHandler([
    defaultRoutedHttpRequestHandler,
    defaultContentNegotiationHttpHandler,
  ]),
);

export const defaultNodeHttpServer = new NodeHttpServer(
  'localhost',
  3000,
  defaultNodeHttpRequestResponseHandler,
);
