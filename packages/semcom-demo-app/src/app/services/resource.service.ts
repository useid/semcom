import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { SolidDataset } from '@inrupt/solid-client';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { getSolidDataset } from '@inrupt/solid-client';

@Injectable({ providedIn: 'root' })
export class ResourceService {

  fetchProfile = (webid: string): Observable<SolidDataset> => from(getSolidDataset(webid, { fetch }));

}
