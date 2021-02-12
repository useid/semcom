import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InitConnectPage, SelectProvider } from './connect.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProviderService } from './services/provider.service';
import { ProvidersLoaded } from './services/provider.actions';
import { login } from '@inrupt/solid-client-authn-browser';

@Injectable()
export class ConnectEffects {

  loadProviders$ = createEffect(() => this.actions$.pipe(
    ofType(InitConnectPage),
    mergeMap(() => this.providerService.getAll()
      .pipe(
        map(providers => (ProvidersLoaded({ providers }))),
        catchError(() => EMPTY)
      ))
    )
  );

  connectProvider$ = createEffect(() => this.actions$.pipe(
    ofType(SelectProvider),
    tap(action => login({ oidcIssuer: action.provider.url, redirectUrl: '/connect/callback' }))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private providerService: ProviderService
  ) {}

}
