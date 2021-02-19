import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { connectPageInit, providerSelected } from './connect.actions';
import { EMPTY } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProviderService } from '../services/provider.service';
import { providersLoaded } from './connect.actions';

@Injectable()
export class ProviderEffects {

  loadProviders$ = createEffect(() => this.actions$.pipe(
    ofType(connectPageInit),
    mergeMap(() => this.providerService.getAll()
      .pipe(
        map(providers => (providersLoaded({ providers }))),
        catchError(() => EMPTY)
      ))
    )
  );

  connectProvider$ = createEffect(() => this.actions$.pipe(
    ofType(providerSelected),
    tap(action => this.providerService.connect(action.provider.url))
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private providerService: ProviderService
  ) {}

}
