import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserModule } from '@angular/platform-browser';
import { ConnectComponent } from './connect/connect.component';
import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { ProviderEffects } from './connect/services/provider.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';
import { reducers } from './app.reducers';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const declarations = [AppComponent, HomeComponent, ConnectComponent];
export const providers = [AppComponent];
export const imports = [
  BrowserModule,
  HttpClientModule,
  AppRoutingModule,
  TranslateModule.forRoot({
    defaultLanguage: 'en',
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  }),
  StoreModule.forRoot(reducers),
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  }),
  StoreRouterConnectingModule.forRoot(),
  EffectsModule.forRoot([ProviderEffects])
];

@NgModule({
  declarations,
  providers,
  bootstrap: [AppComponent],
  imports,
  exports: [TranslateModule]
})

export class AppModule { }
