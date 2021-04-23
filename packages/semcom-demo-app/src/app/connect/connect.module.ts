import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared.module';
import { FEATURE_KEY, connectReducer } from './connect.state';
import { ConnectComponent } from './connect.component';
import { ConnectEffects } from './connect.effects';

export const declarations = [ ConnectComponent ];
export const providers = [ ConnectComponent ];
export const imports = [
  SharedModule,
  StoreModule.forFeature(FEATURE_KEY, connectReducer),
  EffectsModule.forFeature([ ConnectEffects ]),
];

@NgModule({
  declarations,
  providers,
  imports,
  exports: [],
})

export class ConnectModule { }
