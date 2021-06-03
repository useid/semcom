import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { connectSessionInfoSelector } from './connect.state';

@Injectable({
  providedIn: 'root',
})
export class ConnectGuard implements CanActivate{

  sessionInfo$: Observable<ISessionInfo|null> = this.store.select(connectSessionInfoSelector);

  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<true|UrlTree> {

    return this.sessionInfo$.pipe<ISessionInfo|null, true|UrlTree>(
      take(1),
      map((sessionInfo) => {

        if (sessionInfo && sessionInfo.isLoggedIn) {

          return true;

        } else {

          return this.router.parseUrl('/connect');

        }

      }),
    );

  }

}
