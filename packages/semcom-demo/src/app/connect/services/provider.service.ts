
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProviderService {

  getAll(): Observable<Provider[]> {

    return new Observable(subscriber => subscriber.next([
      new Provider('Solid Community', 'https://solidcommunity.net/login'),
      new Provider('Inrupt Broker', 'https://broker.pod.inrupt.com')
    ]));

  }

}
