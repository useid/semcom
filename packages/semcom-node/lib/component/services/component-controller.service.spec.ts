import { ComponentMockService, LoggerConsoleService } from '@digita-ai/semcom-core';
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { ComponentControllerService } from './component-controller.service';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('ComponentControllerService', () => {
    let components: ComponentControllerService = null;

    beforeEach(() => {
        components = new ComponentControllerService(new ComponentMockService(new LoggerConsoleService(), [{ uri: 'test' }]), new LoggerConsoleService());
    });

    it('should be correctly instantiated', (() => {
        expect(components).toBeTruthy();
    }));

    it('should return Hello World', (async () => {
        const ctx: ParameterizedContext<DefaultState, DefaultContext> = createMockContext();

        await components.all(ctx);

        expect(ctx.status).toBe(200);
        expect(ctx.body).toStrictEqual([{ uri: 'test' }]);
    }));
});
