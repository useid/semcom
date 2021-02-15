import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ConnectPageInit, ProviderSelected } from '../connect.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { ProvidersLoaded } from './provider.actions';
import { login } from '@inrupt/solid-client-authn-browser';

@Injectable()
export class ProviderEffects {

  constructor(
    private actions$: Actions,
    private providerService: ProviderService
  ) {}

  loadProviders$ = createEffect(() => this.actions$.pipe(
    ofType(ConnectPageInit),
    mergeMap(() => this.providerService.getAll()
      .pipe(
        map(providers => (ProvidersLoaded({ providers }))),
        catchError(() => EMPTY)
      ))
    )
  );

  connectProvider$ = createEffect(() => this.actions$.pipe(
    ofType(ProviderSelected),
    tap(action => login({ oidcIssuer: action.provider.url, redirectUrl: 'http://localhost:4200/connect/callback' }))
  ), { dispatch: false });

}
