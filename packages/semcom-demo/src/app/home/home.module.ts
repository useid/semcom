import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from 'src/environments/environment';

export const declarations = [HomeComponent];
export const providers = [HomeComponent];
export const imports = [
  SharedModule,
  //StoreModule.forFeature(),
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  }),
  StoreRouterConnectingModule.forRoot(),
  EffectsModule.forRoot([])
];

@NgModule({
  declarations,
  providers,
  imports,
  exports: []
})

export class HomeModule { }
