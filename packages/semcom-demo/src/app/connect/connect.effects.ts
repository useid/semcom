import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { connectPageError, connectPageInit, providerSelected, providersLoaded } from './connect.actions';
import { Injectable } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { of } from 'rxjs';

@Injectable()
export class ConnectEffects {

  loadProviders$ = createEffect(() => this.actions$.pipe(
    ofType(connectPageInit),
    mergeMap(() => this.providerService.getAll()),
    map(providers => providersLoaded({ providers })),
    catchError((error) => of(connectPageError({ error })))
  ));

  connectProvider$ = createEffect(() => this.actions$.pipe(
    ofType(providerSelected),
    tap(action => this.providerService.connect(action.provider.url))
  ), { dispatch: false });

  logConnectPageErrors$ = createEffect(() => this.actions$.pipe(
    ofType(connectPageError),
    tap((error) => console.error(error)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private providerService: ProviderService
  ) {}

}
