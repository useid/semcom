import * as request from 'supertest';
import { MetadataControllerService } from '../../metadata/services/metadata-controller.service';
import { ServerKoaService } from './server-koa.service';

describe('Server', () => {
    let server: ServerKoaService = null;
    const mockListen = jest.fn();

    afterEach(() => {
        mockListen.mockReset();
    });

    it('should be correctly instantiated without options', (() => {
        server = new ServerKoaService();

        expect(server).toBeTruthy();
    }));

    it('should be correctly instantiated with options', (() => {
        server = new ServerKoaService();

        expect(server).toBeTruthy();
    }));

    it('should be start on port 3000 by default', (() => {
        server = new ServerKoaService();
        server.app.listen = mockListen;

        server.start({ controllers: [] });

        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(3000);
    }));

    it('should be start on port specified in options', (() => {
        server = new ServerKoaService();
        server.app.listen = mockListen;

        server.start({ port: 666, controllers: [] });

        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(666);
    }));


    it('should return 200 on registered routes', (async () => {
        server.start({ controllers: [new MetadataControllerService()] });

        const response = await request(server.app.callback()).get('/metadata');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello world');
    }));

    it('should return 404 on unknow routes', (async () => {
        server.start({ controllers: [new MetadataControllerService()] });

        const response = await request(server.app.callback()).get('/foo-bar');
        expect(response.status).toBe(404);
    }));
});
