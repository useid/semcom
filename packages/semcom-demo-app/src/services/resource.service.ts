import { from, Observable } from 'rxjs';
import { SolidDataset, getSolidDataset } from '@inrupt/solid-client';
import { fetch } from '@inrupt/solid-client-authn-browser';

export class ResourceService {

  fetchProfile = (webid: string): Observable<SolidDataset> => from(getSolidDataset(webid, { fetch }));

}
