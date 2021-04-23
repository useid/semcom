import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ProviderService } from '../services/provider.service';
import { connectPageError, connectPageInit, providerSelected, providersLoaded } from './connect.actions';

@Injectable()
export class ConnectEffects {

  loadProviders$ = createEffect(() => this.actions$.pipe(
    ofType(connectPageInit),
    mergeMap(() => this.providerService.getAll()),
    map((providers) => providersLoaded({ providers })),
    catchError((error) => of(connectPageError({ error }))),
  ));

  connectProvider$ = createEffect(() => this.actions$.pipe(
    ofType(providerSelected),
    tap((action) => this.providerService.connect(action.provider.url)),
  ), { dispatch: false });

  logConnectPageErrors$ = createEffect(() => this.actions$.pipe(
    ofType(connectPageError),
    /* eslint-disable no-console -- is error log */
    tap((error) => console.error(error)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private providerService: ProviderService,
  ) {}

}
