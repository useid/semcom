import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Provider } from './connect/models/provider.model';
import { ProviderConnected } from './connect/connect.actions';
import { ProvidersLoaded } from './connect/services/provider.actions';

export interface AppState {
  routerState: RouterReducerState;
  connectState: ConnectState;
}

export interface ConnectState {
  'sessionInfo': ISessionInfo | null;
  'providers': Provider[];
}

export const initialConnectState: ConnectState = {
  sessionInfo: null,
  providers: []
};

export const connectReducer = createReducer(
  initialConnectState,
  on(ProvidersLoaded, (state: ConnectState, { providers }) => ({ ...state, providers })),
  on(ProviderConnected, (state: ConnectState, { sessionInfo }) => ({ ...state, sessionInfo }))
);

export const reducers: ActionReducerMap<AppState> = {
  routerState: routerReducer,
  connectState: connectReducer
};


