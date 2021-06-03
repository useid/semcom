import InputComponent from '../lib/components/input';
import PayslipComponent from '../lib/components/payslip';
import ProfileComponent from '../lib/components/profile';

/**
 * Register tags for components.
 */
customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);
