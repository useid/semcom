import { FEATURE_KEY, homeReducer } from './home.state';
import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './home.component';
import { HomeEffects } from './home.effects';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { StoreModule } from '@ngrx/store';

export const declarations = [HomeComponent];
export const providers = [HomeComponent];
export const imports = [
  SharedModule,
  StoreModule.forFeature(FEATURE_KEY, homeReducer),
  EffectsModule.forFeature([HomeEffects])
];

@NgModule({
  declarations,
  providers,
  imports,
  exports: []
})

export class HomeModule { }
