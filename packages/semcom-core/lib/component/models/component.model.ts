import { ComponentMetadata } from './component-metadata.model';
import { DatasetIndexed } from 'rdf-dataset-indexed/dataset';

export interface Component {

  metadata: ComponentMetadata;

  rdfData: DatasetIndexed;

}
