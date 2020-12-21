import * as request from 'supertest';
import { ServerService } from './server.service';

describe('Server', () => {
    let server: ServerService = null;
    const mockListen = jest.fn();

    afterEach(() => {
        mockListen.mockReset();
    });

    it('should be correctly instantiated without options', (() => {
        server = new ServerService();

        expect(server).toBeTruthy();
    }));

    it('should be correctly instantiated with options', (() => {
        server = new ServerService({ port: 666 });

        expect(server).toBeTruthy();
    }));

    it('should be start on port 3000 by default', (() => {
        server = new ServerService();
        server.app.listen = mockListen;

        server.start();

        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(3000);
    }));

    it('should be start on port specified in options', (() => {
        server = new ServerService({ port: 666 });
        server.app.listen = mockListen;

        server.start();

        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(666);
    }));


    it('should return 200 on registered routes', (async () => {
        const response = await request(server.app.callback()).get('/metadata');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello world');
    }));

    it('should return 404 on unknow routes', (async () => {
        const response = await request(server.app.callback()).get('/foo-bar');
        expect(response.status).toBe(404);
    }));
});
