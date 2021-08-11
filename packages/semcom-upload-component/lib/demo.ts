import { FormElementComponent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { inspect } from '@xstate/inspect';
import { ProviderListComponent, LoadingComponent, FeedbackComponent, AuthenticateComponent } from '@digita-ai/ui-transfer-components';
import { SemComRegisterComponent } from './components/sem-com-register.component';
import { SemComStoreSelectionComponent } from './components/sem-com-store-selection.component';
import { SemComUploadFormComponent } from './components/sem-com-upload-form.component';

/** Starts the xstate devtools in new window */
inspect({ iframe: false });

/** Register tags for components. */
customElements.define('auth-flow', AuthenticateComponent);
customElements.define('provider-list', ProviderListComponent);
customElements.define('loading-component', LoadingComponent);
customElements.define('feedback-component', FeedbackComponent);
customElements.define('sem-com-register-component', SemComRegisterComponent);
customElements.define('sem-com-store-selection', SemComStoreSelectionComponent);
customElements.define('sem-com-upload-form', SemComUploadFormComponent);
customElements.define('form-element-component', FormElementComponent);
