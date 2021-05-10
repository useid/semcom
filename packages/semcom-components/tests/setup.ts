import InputComponent from '../lib/components/input';
import PayslipComponent from '../lib/components/payslip';
import ProfileComponent from '../lib/components/profile';
import Profile1Component from '../lib/components/profile1';
import Profile2Component from '../lib/components/profile2';

/**
 * Register tags for components.
 */
customElements.define('profile-component', ProfileComponent);
customElements.define('profile1-component', Profile1Component);
customElements.define('profile2-component', Profile2Component);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);
