import { Parser } from 'n3';
import { addListener, ComponentEventTypes, ComponentReadEvent, ComponentResponseEvent, ComponentWriteEvent } from '@digita-ai/semcom-sdk';
import { CardComponent, ContentHeaderComponent, FormElementComponent, SidebarItemComponent, SidebarListComponent, SidebarListItemComponent } from '@digita-ai/dgt-components';
import { ProfileComponent } from '../lib/components/profile.component';
import { DocumentComponent } from '../lib/components/document.component';
import { PayslipComponent } from '../lib/components/payslip.component';
import { InputComponent } from '../lib/components/input.component';
import { GenderComponent } from '../lib/components/gender.component';
import { BarcodeComponent } from '../lib/components/barcode.component';
import { CredentialComponent } from '../lib/components/credential.component';
import { ProfileContactComponent } from '../lib/components/profile-contact.component';
import { ProfileNameComponent } from '../lib/components/profile-name.component';
import { ProfilePayslipComponent } from '../lib/components/profile-payslip.component';

customElements.define('profile-component', ProfileComponent);
customElements.define('payslip-component', PayslipComponent);
customElements.define('input-component', InputComponent);
customElements.define('gender-component', GenderComponent);
customElements.define('document-component', DocumentComponent);
customElements.define('barcode-component', BarcodeComponent);
customElements.define('credential-component', CredentialComponent);
customElements.define('profile-contact-component', ProfileContactComponent);
customElements.define('profile-name-component', ProfileNameComponent);
customElements.define('profile-payslip-component', ProfilePayslipComponent);
customElements.define('nde-form-element', FormElementComponent);
customElements.define('nde-card', CardComponent);
customElements.define('card-header', ContentHeaderComponent);
customElements.define('nde-sidebar-list-item', SidebarListItemComponent);
customElements.define('nde-sidebar-list', SidebarListComponent);
customElements.define('nde-sidebar-item', SidebarItemComponent);

const parser = new Parser();

addListener(ComponentEventTypes.READ, 'quads', document, async (event: ComponentReadEvent<'quads'>) => {

  const response = await fetch(event.detail.uri);
  const profileText = await response.text();
  const quads = parser.parse(profileText);

  return new ComponentResponseEvent({
    detail: { uri: event.detail.uri, cause: event, data: quads, success: true, type: 'quads' },
  });

});

addListener(ComponentEventTypes.WRITE, 'quads', document, async (event: ComponentWriteEvent<'quads'>) => {

  try {

    new URL(event.detail.uri);

    const response = new Promise<ComponentResponseEvent<'quads'>>((resolve, reject) => {

      setTimeout(() =>
        resolve(new ComponentResponseEvent({
          detail: { ...event.detail, cause: event, success: true },
        })), 2000);

    });

    return response;

  } catch(e) {

    return new ComponentResponseEvent({
      detail: { ...event.detail, cause: event, success: false },
    });

  }

});
