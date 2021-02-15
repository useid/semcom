import { CanActivate, Resolve, Router, UrlTree } from '@angular/router';
import { ISessionInfo, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { map, take } from 'rxjs/operators';
import { AppState } from '../app.reducers';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ProviderConnected } from './connect.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ConnectGuard implements CanActivate, Resolve<void> {

  sessionInfo$: Observable<ISessionInfo|null> = this.store.select(state => state.connectState.sessionInfo);

  constructor(private store: Store<AppState>, private router: Router, private location: Location) {}

  resolve(): void {
    handleIncomingRedirect(window.location.href).then( ( sessionInfo: ISessionInfo | undefined ) => {
      if (sessionInfo) {
        this.store.dispatch(ProviderConnected({ sessionInfo }));
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/connect');
      }
    });
  }

  canActivate(): Observable<true|UrlTree> {
    // const redirectUrl: string = state.url;
    return this.checkLogin(/* redirectUrl */);
  }

  checkLogin(/* redirectUrl: string */): Observable<true|UrlTree> {
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
