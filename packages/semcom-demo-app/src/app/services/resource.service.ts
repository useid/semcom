import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SolidDataset, getSolidDataset } from '@inrupt/solid-client';
import { fetch } from '@inrupt/solid-client-authn-browser';

@Injectable({ providedIn: 'root' })
export class ResourceService {

  fetchProfile = (webid: string): Observable<SolidDataset> => from(getSolidDataset(webid, { fetch }));

}
