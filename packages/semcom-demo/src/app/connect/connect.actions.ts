import { createAction, props } from '@ngrx/store';
import { Provider } from './models/provider.model';

export const InitConnectPage = createAction(
  '[Connect] Init Connect Page'
);

export const SelectProvider = createAction(
  '[Connect] Select Provider',
  props<{ provider: Provider }>()
);
