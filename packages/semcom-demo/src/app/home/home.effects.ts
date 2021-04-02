import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { componentsRegistered, componentsSelected, homePageError, homePageInit, shapesDetected } from './home.actions';
import { forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { SemComService } from '../services/semcom.service';
import { Store } from '@ngrx/store';
import { connectWebIdSelector } from '../connect/connect.state';

@Injectable()
export class HomeEffects {

  detectShapesOnInit$ = createEffect(() => this.actions$.pipe(
    ofType(homePageInit),
    concatLatestFrom(() => this.store.select(connectWebIdSelector)),
    mergeMap(([, webid]) => {
      if (webid) {
        return this.semComService.detectShapes(webid);
      } else {
        throw new Error('Could not load profile: no webid in session.');
      }
    }),
    map((shapeIds) => shapesDetected({ shapeIds })),
    catchError((error) => of(homePageError({ error })))
  ));

  queryMetadataFromShapes$ = createEffect(() => this.actions$.pipe(
    ofType(shapesDetected),
    mergeMap(({shapeIds}) => forkJoin(shapeIds.map((shapeId) => this.semComService.queryComponents(shapeId)))),
    map((resultsPerShape) => resultsPerShape.filter(results => results.length > 0)),
    tap((resultsPerShape) => console.log(resultsPerShape)),
    map((resultsPerShape) => resultsPerShape.map(results => results[0])),
    map((selection) => componentsSelected({ components: selection })),
    catchError((error) => of(homePageError({ error })))
  ));

  fetchComponentsFromMetadata$ = createEffect(() => this.actions$.pipe(
    ofType(componentsSelected),
    mergeMap(({ components }) => forkJoin(components.map((metadata) => this.semComService.registerComponent(metadata)))),
    tap((tags) => console.log('Registered ', tags)),
    map((tags) => componentsRegistered({ tags })),
    catchError((error) => of(homePageError({ error })))
  ));

  // loadProfileData$ = createEffect(() => this.actions$.pipe(
  //   ofType(homePageInit),
  //   concatLatestFrom(() => this.store.select(state => state.connectState?.sessionInfo?.webId)),
  //   mergeMap(([, webid]) => {
  //     if (webid) {
  //       return this.resourceService.fetchProfile(webid);
  //     } else {
  //       throw new Error('Could not load profile: no webid in session.');
  //     }
  //   }),
  //   map((profile) => profileLoaded({ profile })),
  //   catchError((error) => of(homePageError({ error })))
  // ));

  logHomePageErrors$ = createEffect(() => this.actions$.pipe(
    ofType(homePageError),
    tap((error) => console.error(error.error)),
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store: Store,
    private semComService: SemComService
  ) {}

}
