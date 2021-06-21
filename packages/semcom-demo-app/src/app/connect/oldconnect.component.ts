import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Provider } from '../models/provider.model';
import { connectPageInit, providerSelected } from './connect.actions';
import { connectProvidersSelector } from './connect.state';


export class ConnectComponent implements OnInit {

  providers$: Observable<Provider[]> = this.store.select<Provider[]>(connectProvidersSelector);

  constructor(private store: Store) {}

  ngOnInit(): void {

    this.store.dispatch(connectPageInit());

  }

  connect(provider: Provider): void {

    if(!provider) {

      throw new Error();

    }

    this.store.dispatch(providerSelected({ provider }));

  }

}
