import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';
import { MetadataControllerService } from './metadata-controller.service';
import { createMockContext } from '@shopify/jest-koa-mocks';

describe('MetadataControllerService', () => {
    let metadata: MetadataControllerService = null;

    beforeEach(() => {
        metadata = new MetadataControllerService();
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
