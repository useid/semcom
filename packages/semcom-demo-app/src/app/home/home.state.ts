import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { SolidDataset } from '@inrupt/solid-client';
import { componentsRegistered } from './home.actions';

export const FEATURE_KEY = 'semcom-home-feature';
export interface HomeState {
  'profile': SolidDataset | null;
  'components': string[];
}

export const initialHomeState: HomeState = {
  profile: null,
  components: [],
};

export const homeReducer = createReducer(
  initialHomeState,
  on(componentsRegistered, (state: HomeState, { tags }) => ({ ...state, components: tags })),
);

export const homeSelector = createFeatureSelector<any, HomeState>(FEATURE_KEY);
export const homeComponentsSelector = createSelector(homeSelector, state => state.components);
