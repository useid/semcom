import { FEATURE_KEY, connectReducer } from './connect.state';
import { ConnectComponent } from './connect.component';
import { ConnectEffects } from './connect.effects';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { StoreModule } from '@ngrx/store';

export const declarations = [ConnectComponent];
export const providers = [ConnectComponent];
export const imports = [
  SharedModule,
  StoreModule.forFeature(FEATURE_KEY, connectReducer),
  EffectsModule.forFeature([ConnectEffects])
];

@NgModule({
  declarations,
  providers,
  imports,
  exports: []
})

export class ConnectModule { }
