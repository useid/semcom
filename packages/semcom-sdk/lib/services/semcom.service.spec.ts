import { SemComService } from './semcom.service';

describe('SemComService', () => {

    it('should be correctly instantiated', (() => {
        const service = new SemComService();

        expect(service).toBeTruthy();
    }));
});
