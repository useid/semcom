import * as Quad from 'rdf-quad';
import { Component, LoggerService } from '@digita-ai/semcom-core';

/** Service that transforms Components */
export class ComponentTransformerService {

    constructor(
        private logger: LoggerService,
    ) { }

    /**
     * Transforms a Component to quads
     * @param component The component to transform
     */
    public toQuadsOne(component: Component): Quad[] {
        this.logger.log('debug', 'Transforming component to quads', { component });
        return [
            Quad(
                `https://node.semcom.digita.ai/c/${component.uri}`,
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                'http://semcom.digita.ai/voc#component',
            ),
            Quad(
                `https://node.semcom.digita.ai/c/${component.uri}`,
                'http://semcom.digita.ai/voc#label',
                component.label,
            ),
        ].reduce((acc, val) => acc.concat(val), []);
    }

    /**
     * Transforms multiple Components to quads
     * @param components The components to transform
     */
    public toQuads(components: Component[]): Quad[] {
        return components.map(component => this.toQuadsOne(component))
            .reduce((acc, val) => acc.concat(val), []);
    }

    /**
     * Transforms quads to a Component
     * @param quads The quads to transform
     */
    public fromQuads(quads: Quad[]): Component {
        throw new Error('Not implemented');
    }

}
