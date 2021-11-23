import { from, Observable } from 'rxjs';
import { SolidDataset, getSolidDataset } from '@inrupt/solid-client';
import { fetch } from '@digita-ai/inrupt-solid-client';

/**
 * A resource service for fetching the profile of a webid and querying a solid dataset returned in turtle format.
 */
export class ResourceService {

  fetchProfile = (webid: string): Observable<SolidDataset> => from(getSolidDataset(webid, { fetch }));

}
