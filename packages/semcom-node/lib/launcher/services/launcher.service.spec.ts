import { LauncherService } from './launcher.service';
import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { ServerMockService } from '../../server/services/server-mock.service';

describe('LauncherService', () => {

    it('should be correctly instantiated', (() => {
        const server = new ServerMockService(new LoggerConsoleService());
        const launcher: LauncherService = new LauncherService(new LoggerConsoleService(), server, { controllers: [], handlers: [] });

        expect(launcher).toBeTruthy();
    }));

    it('should start server when launching', (() => {
        const server = new ServerMockService(new LoggerConsoleService());
        const launcher: LauncherService = new LauncherService(new LoggerConsoleService(), server, { controllers: [], handlers: [] });

        const mockListen = jest.fn();
        server.start = mockListen;

        launcher.launch();

        expect(mockListen.mock.calls.length).toBe(1);
    }));
});
