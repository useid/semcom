import { Quad } from 'rdf-js';

/**
 * RDF data is structured as an array of quads.
 */
export type ComponentRDFData = Quad[];

/**
 * Describes the kinds of data a component could work with.
 */
export type ComponentData = ComponentRDFData;
