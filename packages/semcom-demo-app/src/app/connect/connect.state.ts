import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { providerConnected, providersLoaded } from '../connect/connect.actions';
import { Provider } from '../models/provider.model';

export const FEATURE_KEY = 'semcom-connect-feature';

export interface ConnectState {
  'providers': Provider[];
  'sessionInfo': ISessionInfo | null;
}

export const initialConnectState: ConnectState = {
  providers: [],
  sessionInfo: null,
};

export const connectReducer = createReducer(
  initialConnectState,
  on(providersLoaded, (state: ConnectState, { providers }) => ({ ...state, providers })),
  on(providerConnected, (state: ConnectState, { sessionInfo }) => ({ ...state, sessionInfo })),
);

export const connectSelector = createFeatureSelector<any, ConnectState>(FEATURE_KEY);
export const connectProvidersSelector = createSelector(connectSelector, (state) => state.providers);
export const connectSessionInfoSelector = createSelector(connectSelector, (state) => state.sessionInfo);
export const connectWebIdSelector = createSelector(
  connectSessionInfoSelector,
  (sessionInfo) => sessionInfo
    ? sessionInfo.webId
    : undefined,
);

