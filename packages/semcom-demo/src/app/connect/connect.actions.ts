import { createAction, props } from '@ngrx/store';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Provider } from './models/provider.model';

export const ConnectPageInit = createAction(
  '[Connect] Connect Page Initialized'
);

export const ProviderSelected = createAction(
  '[Connect] Provider Selected',
  props<{ provider: Provider }>()
);

export const ProviderConnected = createAction(
  '[Connect] Provider Connected',
  props<{ sessionInfo: ISessionInfo }>()
);
