import { ComponentMockService, LoggerConsoleService } from '@digita-ai/semcom-core';
import { ComponentControllerService } from './component-controller.service';
import { ServerRequest } from '../../server/models/server-request.model';

describe('ComponentControllerService', () => {
    let components: ComponentControllerService = null;

    beforeEach(() => {
        components = new ComponentControllerService(new ComponentMockService(new LoggerConsoleService(), [{ uri: 'test' }]), new LoggerConsoleService());
    });

    it('should be correctly instantiated', (() => {
        expect(components).toBeTruthy();
    }));

    it('should return Hello World', (async () => {
        const request: ServerRequest = { method: 'GET' };

        const response = await components.all(request);

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([{ uri: 'test' }]);
    }));
});
