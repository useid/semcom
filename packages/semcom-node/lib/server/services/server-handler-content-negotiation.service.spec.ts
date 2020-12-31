import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { ServerHandlerContentNegotiationService } from './server-handler-content-negotiation.service';
import { ServerRequest } from '../models/server-request.model';
import { ServerResponse } from '../models/server-response.model';

describe('ServerHandlerContentNegotiationService', () => {
    it('should be correctly instantiated', (() => {
        const server = new ServerHandlerContentNegotiationService(new LoggerConsoleService());

        expect(server).toBeTruthy();
    }));

    it('should support accept */*', (async () => {
        const server = new ServerHandlerContentNegotiationService(new LoggerConsoleService());
        const request: ServerRequest = { method: 'GET', headers: { accept: '*/*' } };
        const response: ServerResponse = { status: 200, body: 'foo' };
        const canHandle = await server.canHandle(request, response);

        expect(canHandle).toBe(true);
    }));

    it('should support accept text/turtle', (async () => {
        const server = new ServerHandlerContentNegotiationService(new LoggerConsoleService());
        const request: ServerRequest = { method: 'GET', headers: { accept: 'text/turtle' } };
        const response: ServerResponse = { status: 200, body: 'foo' };
        const canHandle = await server.canHandle(request, response);

        expect(canHandle).toBe(true);
    }));

    it('should not support accept foo/bar', (async () => {
        const server = new ServerHandlerContentNegotiationService(new LoggerConsoleService());
        const request: ServerRequest = { method: 'GET', headers: { accept: 'foo/bar' } };
        const response: ServerResponse = { status: 200, body: 'foo' };
        const canHandle = await server.canHandle(request, response);

        expect(canHandle).toBe(false);
    }));
});
