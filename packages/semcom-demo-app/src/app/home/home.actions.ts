import { createAction, props } from '@ngrx/store';
import { ComponentMetadata } from '@digita-ai/semcom-core';
import { SolidDataset } from '@inrupt/solid-client';

export const homePageInit = createAction(
  '[Home] Home Page Initialized',
);

export const homePageError = createAction(
  '[Home] Home Page Error',
  props<{ error: any }>(),
);

export const profileLoaded = createAction(
  '[Home] Profile Data Loaded',
  props<{ profile: SolidDataset }>(),
);

export const shapesDetected = createAction(
  '[Home] Data Shapes Detected',
  props<{ shapeIds: string[] }>(),
);

export const componentsSelected = createAction(
  '[Home] Components Selected',
  props<{ components: ComponentMetadata[] }>(),
);

export const componentsRegistered = createAction(
  '[Home] Components Registered',
  props<{ tags: string[] }>(),
);
