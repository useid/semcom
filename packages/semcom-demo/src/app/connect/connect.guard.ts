import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConnectService } from './connect.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectGuard implements CanActivate {
  constructor(private connectService: ConnectService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true|UrlTree {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): true|UrlTree {
    if (this.connectService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.connectService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('/connect');
  }


}
