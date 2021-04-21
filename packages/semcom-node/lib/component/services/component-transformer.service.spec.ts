import { ComponentTransformerService } from './component-transformer.service';
import { LoggerConsoleService } from '@digita-ai/semcom-core';

describe('ComponentTransformerService', () => {
    let transformer: ComponentTransformerService = null;

    beforeEach(() => {
        transformer = new ComponentTransformerService(new LoggerConsoleService());
    });

    it('should be correctly instantiated', (() => {
        expect(transformer).toBeTruthy();
    }));
});
