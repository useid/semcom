import { createAction, props } from '@ngrx/store';
import { Provider } from '../models/provider.model';

export const providersLoaded = createAction(
  '[ProviderService] Providers Loaded',
  props<{ providers: Provider[] }>()
);
