import { RouterModule, Routes } from '@angular/router';
import { ConnectComponent } from './connect/connect.component';
import { ConnectGuard } from './connect/connect.guard';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, {
    path: 'home',
    canActivate: [ConnectGuard],
    component: HomeComponent
  }, {
    path: 'connect',
    component: ConnectComponent,
    children: [
      {
        path: 'callback',
        resolve: [ConnectGuard],
        children: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
