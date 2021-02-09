import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '../environments/environment';


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

export const declarations = [AppComponent];
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
  StoreModule.forRoot({
    router: routerReducer
  }),
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
  bootstrap: [AppComponent],
  imports
})
export class AppModule { }
