import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { MetadataController } from './metadata.controller';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('MetadataController', () => {
    let metadata: MetadataController = null;

    beforeEach(() => {
        metadata = new MetadataController();
    });

    it('should be correctly instantiated', (() => {
        expect(metadata).toBeTruthy();
    }));

    it('should return Hello World', (() => {
        const ctx: ParameterizedContext<DefaultState, DefaultContext> = createMockContext({state: {views: 31}});
        
        metadata.all(ctx);
        
        expect(ctx.status).toBe(200);
        expect(ctx.body).toBe('Hello world');
    }));
});
