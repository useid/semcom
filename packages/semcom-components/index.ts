import DataFactory from 'rdf-ext';
import type { DatasetIndexed } from 'rdf-dataset-indexed/dataset';
import { ProfileComponent } from './components/profile';
import type { Quad } from 'rdf-js';

// register service
customElements.define('profile-component', ProfileComponent);

declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
  }
}

// data retrieval

const subject = DataFactory.namedNode('http://example.org/subject');
const predicate = DataFactory.namedNode('http://example.org/predicate');
const object = DataFactory.literal('Stijn');

const quad: Quad = DataFactory.quad(subject, predicate, object);

const data: DatasetIndexed<Quad, Quad> = DataFactory.dataset([quad]);


// client app

const profile = document.createElement('profile-component');

profile.rdfData = data;

document.body.appendChild(profile);


export * from './components/profile';
