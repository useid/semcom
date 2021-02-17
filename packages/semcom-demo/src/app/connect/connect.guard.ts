import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ConnectGuard implements CanActivate{

  sessionInfo$: Observable<ISessionInfo|null> = this.store.select(state => state.connectState.sessionInfo);

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<true|UrlTree> {
    return this.sessionInfo$.pipe<ISessionInfo|null, true|UrlTree>(
      take(1),
      map(sessionInfo => {
        if (sessionInfo && sessionInfo.isLoggedIn) {
          return true;
        } else {
          return this.router.parseUrl('/connect');
        }
      })
    );
  }

}
