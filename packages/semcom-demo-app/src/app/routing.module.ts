import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConnectComponent } from './connect/connect.component';
import { ConnectGuard } from './connect/connect.guard';
import { ConnectResolver } from './connect/connect.resolver';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  }, {
    path: 'home',
    canActivate: [ ConnectGuard ],
    component: HomeComponent,
  }, {
    path: 'connect',
    component: ConnectComponent,
    children: [
      {
        path: 'callback',
        resolve: [ ConnectResolver ],
        children: [],
      },
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }
