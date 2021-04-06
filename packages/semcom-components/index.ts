import PayslipComponent from './components/payslip';
import ProfileComponent from './components/profile';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
declare global {
  interface HTMLElementTagNameMap {
    'profile-component': ProfileComponent;
    'payslip-component': PayslipComponent;
  }
}

fetch('./testdata/profile.txt').then((response) => {
  response.text().then((profileFile) => {
    const mockFetchProfile = () => Promise.resolve(new Response(profileFile));
    const profile = document.createElement('profile-component');
    profile.data('i-dont-matter', mockFetchProfile);
    document.body.appendChild(profile);
  });
});

fetch('./testdata/singlePayslip.txt').then((response) => {
  response.text().then((payslipFile) => {
    const mockFetchPayslip = () => Promise.resolve(new Response(payslipFile));
    const payslip = document.createElement('payslip-component');
    payslip.data('i-dont-matter', mockFetchPayslip);
    document.body.appendChild(payslip);
  });
});

export * from './components/profile';
export * from './components/payslip';
