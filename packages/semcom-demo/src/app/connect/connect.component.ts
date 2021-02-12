import { Component, OnInit } from '@angular/core';
import { InitConnectPage, SelectProvider } from './connect.actions';
import { Observable } from 'rxjs';
import { Provider } from './models/provider.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'demo-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit{

    // providers$: Observable<Provider[]> = this.store.select(state => state.providers);
    providers$: Observable<Provider[]> = new Observable(subscriber => subscriber.next([
      new Provider('Solid Community', 'https://solidcommunity.net/login'),
      new Provider('Inrupt Broker', 'https://broker.pod.inrupt.com')
    ]));

    constructor(private store: Store<{ providers: Provider[] }>) {}

    ngOnInit(): void {
      this.store.dispatch(InitConnectPage());
    }

    connect(provider: Provider): void {
      this.store.dispatch(SelectProvider({ provider }));
    }

}
