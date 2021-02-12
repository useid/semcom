import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';

// handleIncomingRedirect(url?: string): Promise<undefined | ISessionInfo>


@Injectable({
  providedIn: 'root',
})
export class ConnectGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true|UrlTree {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): true|UrlTree {
    return this.router.parseUrl('/connect');
  }


}
