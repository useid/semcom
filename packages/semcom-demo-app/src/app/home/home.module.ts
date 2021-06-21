import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared.module';
import { FEATURE_KEY, homeReducer } from './home.state';
import { HomeComponent } from './oldhome.component';
import { HomeEffects } from './home.effects';

export const declarations = [ HomeComponent ];
export const providers = [ HomeComponent ];
export const imports = [
  SharedModule,
  StoreModule.forFeature(FEATURE_KEY, homeReducer),
  EffectsModule.forFeature([ HomeEffects ]),
];

@NgModule({
  declarations,
  providers,
  imports,
  exports: [],
})

export class HomeModule { }
