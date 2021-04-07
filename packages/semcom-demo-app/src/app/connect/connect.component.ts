import { Component, OnInit } from '@angular/core';
import { connectPageInit, providerSelected } from './connect.actions';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider.model';
import { Store } from '@ngrx/store';
import { connectProvidersSelector } from './connect.state';

@Component({
  selector: 'demo-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

    providers$: Observable<Provider[]> = this.store.select<Provider[]>(connectProvidersSelector);

    constructor(private store: Store) {}

    ngOnInit(): void {
      this.store.dispatch(connectPageInit());
    }

    connect(provider: Provider): void {
      if(!provider) {throw new Error();}
      this.store.dispatch(providerSelected({ provider }));
    }

}
