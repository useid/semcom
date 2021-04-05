import { ISessionInfo, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { Resolve, Router } from '@angular/router';
import { AppState } from '../app.reducers';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { providerConnected } from './connect.actions';

@Injectable({
  providedIn: 'root',
})
export class ConnectResolver implements Resolve<void> {

  sessionInfo$: Observable<ISessionInfo|null> = this.store.select(state => state.connectState.sessionInfo);

  constructor(private store: Store<AppState>, private router: Router, private location: Location) {}

  resolve(): void {
    handleIncomingRedirect(window.location.href).then( ( sessionInfo: ISessionInfo | undefined ) => {
      if (sessionInfo) {
        this.store.dispatch(providerConnected({ sessionInfo }));
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/connect');
      }
    });
  }

}
