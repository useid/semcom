import { createAction, props } from '@ngrx/store';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Provider } from './models/provider.model';

export const connectPageInit = createAction(
  '[Connect] Connect Page Initialized'
);

export const providerSelected = createAction(
  '[Connect] Provider Selected',
  props<{ provider: Provider }>()
);

export const providerConnected = createAction(
  '[Connect] Provider Connected',
  props<{ sessionInfo: ISessionInfo }>()
);
