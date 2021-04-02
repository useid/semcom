import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ConnectModule } from './connect/connect.module';
import { EffectsModule } from '@ngrx/effects';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';

export const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http);

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
      useFactory: httpLoaderFactory,
      deps: [HttpClient]
    }
  }),
  StoreModule.forRoot({
    routerFeature: routerReducer,
  }),
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  }),
  StoreRouterConnectingModule.forRoot(),
  EffectsModule.forRoot([]),
  HomeModule,
  ConnectModule,
];

@NgModule({
  declarations,
  providers,
  bootstrap: [AppComponent],
  imports,
  exports: [TranslateModule]
})

export class AppModule { }
