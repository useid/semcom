import { from, Observable } from 'rxjs';
import { SolidDataset, getSolidDataset } from '@inrupt/solid-client';
import { fetch } from '@digita-ai/inrupt-solid-client';

/**
 * A helper service to fetch the profile of a WebID.
 */
export class ResourceService {

  fetchProfile = (webid: string): Observable<SolidDataset> => from(getSolidDataset(webid, { fetch }));

}
