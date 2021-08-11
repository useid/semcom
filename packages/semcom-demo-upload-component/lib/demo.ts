import { AuthenticateComponent, ProviderListComponent, LoadingComponent, FeedbackComponent } from '@digita-ai/ui-transfer-components';
import { FormElementComponent } from '@netwerk-digitaal-erfgoed/solid-crs-components';
import { SemComRegisterComponent, SemComStoreSelectionComponent, SemComUploadFormComponent } from '@digita-ai/semcom-upload-component';

customElements.define('sem-com-register-component', SemComRegisterComponent);
customElements.define('auth-flow', AuthenticateComponent);
customElements.define('provider-list', ProviderListComponent);
customElements.define('loading-component', LoadingComponent);
customElements.define('feedback-component', FeedbackComponent);
customElements.define('sem-com-store-selection', SemComStoreSelectionComponent);
customElements.define('sem-com-upload-form', SemComUploadFormComponent);
customElements.define('form-element-component', FormElementComponent);
