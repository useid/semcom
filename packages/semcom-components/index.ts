import DataFactory from 'rdf-ext';
import type { DatasetIndexed } from 'rdf-dataset-indexed/dataset';
import { PayslipComponent } from './components/payslip';
import { ProfileComponent } from './components/profile';
import type { Quad } from 'rdf-js';

// register service

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
    'payslip-component': PayslipComponent;
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
const payslip = document.createElement('payslip-component');

profile.rdfData = data;
payslip.rdfData = data;

document.body.appendChild(profile);
document.body.appendChild(payslip);

export * from './components/profile';
export * from './components/payslip';
