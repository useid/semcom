import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { providerConnected, providersLoaded } from './connect/connect.actions';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Provider } from './models/provider.model';

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
  on(providersLoaded, (state: ConnectState, { providers }) => ({ ...state, providers })),
  on(providerConnected, (state: ConnectState, { sessionInfo }) => ({ ...state, sessionInfo }))
);

export const reducers: ActionReducerMap<AppState> = {
  routerState: routerReducer,
  connectState: connectReducer
};


