import { Component } from '../models/component.model';
import { ComponentService } from './component.service';
import { LoggerService } from '../../logger/services/logger.service';

export class ComponentMockService extends ComponentService {
    constructor(private logger: LoggerService, private resources: Component[]) {
        super();
    }

    public async all(): Promise<Component[]> {
        this.logger.log('debug', 'Getting all components', { resources: this.resources });

        return this.resources;
    }
}
