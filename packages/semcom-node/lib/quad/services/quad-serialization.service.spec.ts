import { LoggerConsoleService } from '@digita-ai/semcom-core';
import { QuadSerializationService } from './quad-serialization.service';

describe('ComponentControllerService', () => {
    let quads: QuadSerializationService = null;

    beforeEach(() => {
        quads = new QuadSerializationService(new LoggerConsoleService());
    });

    it('should be correctly instantiated', (() => {
        expect(quads).toBeTruthy();
    }));
});
