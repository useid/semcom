import { AppState, ConnectState } from '../app.reducers';
import { Component, OnInit } from '@angular/core';
import { ConnectPageInit, ProviderSelected } from './connect.actions';
import { Observable } from 'rxjs';
import { Provider } from './models/provider.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'demo-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit{

    providers$: Observable<Provider[]> = this.store.select<Provider[]>(state => state.connectState.providers);

    constructor(private store: Store<AppState>) {}

    ngOnInit(): void {
      this.store.dispatch(ConnectPageInit());
    }

    connect(provider: Provider): void {
      this.store.dispatch(ProviderSelected({ provider }));
    }

}
