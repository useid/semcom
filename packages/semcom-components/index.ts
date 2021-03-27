import DataFactory from 'rdf-ext';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { PayslipComponent } from './components/payslip';
import { ProfileComponent } from './components/profile';
import type { Quad } from 'rdf-js';


// mock registration service

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
    'payslip-component': PayslipComponent;
  }
}


// mock data retrieval

const subject = DataFactory.namedNode('http://example.org/subject');
const name = DataFactory.namedNode('http://example.org/name');
const paid = DataFactory.namedNode('http://example.org/paid');
const stijn = DataFactory.literal('Stijn');
const money = DataFactory.literal((5.32).toString(10));

const stmt1: Quad = DataFactory.quad(subject, name, stijn);
const stmt2: Quad = DataFactory.quad(subject, paid, money);

const data: DatasetExt = DataFactory.dataset([stmt1, stmt2]);

const mockFetch = () => Promise.resolve(new Response(data.toCanonical()));


// client app

const profile = document.createElement('profile-component');
const payslip = document.createElement('payslip-component');

profile.data('i-dont-matter', mockFetch);
payslip.data('i-dont-matter', mockFetch);

document.body.appendChild(profile);
document.body.appendChild(payslip);


// exports

export * from './components/profile';
export * from './components/payslip';
