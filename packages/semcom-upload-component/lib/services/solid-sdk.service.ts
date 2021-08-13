import { login, getSolidDataset, handleIncomingRedirect, getThing, getUrlAll, logout, getStringNoLocale, Thing } from '@digita-ai/ui-transfer-solid-client';
import { Session } from '../models/session.model';
import { Profile } from '../models/profile.model';
import { Issuer } from '../models/issuer.model';
import { SolidService } from './solid.service';

// Taken from UI-transfer. Included here because importing fetch from ui-transfer (which is imported from inrupt)
// does not work for an unknown reason.

/**
 * An implementation of the Solid service which uses Solid Client.
 */
export class SolidSDKService implements SolidService {

  /**
   * Instantiates a solid sdk service.
   */
  constructor (private clientName: string) {}

  async validateIssuer(issuer: string): Promise<boolean> {

    let openidConfig;
    let poweredByHeader;

    try {

      const openidConfigResponse = await fetch(new URL('/.well-known/openid-configuration', issuer).toString());
      openidConfig = await openidConfigResponse.json();
      poweredByHeader = openidConfigResponse.headers.get('X-Powered-By');

    } catch(e) { return false; }

    if (
    // Inrupt.net isn't (fully) Solid OIDC-compliant, therefore we check its X-Powered-By header
      !openidConfig && (poweredByHeader.includes('solid') || openidConfig.solid_oidc_supported !== 'https://solidproject.org/TR/solid-oidc')
    ) return false;

    return true;

  }

  /**
   * Retrieves the value of the oidcIssuer triple from a profile document
   * for a given WebID
   *
   * @param webId The WebID for which to retrieve the OIDC issuer
   */
  async getIssuer(webId: string): Promise<Issuer> { return this.getIssuers(webId).then((issuers) => issuers[0]); }

  /**
   * Retrieves the value of the oidcIssuer triple from a profile document
   * for a given WebID
   *
   * @param webId The WebID for which to retrieve the OIDC issuers
   */
  async getIssuers(webId: string): Promise<Issuer[]> {

    const profile = await this.profileThing(webId);

    // Gets the issuers from the user's profile.
    const issuers = getUrlAll(profile, 'http://www.w3.org/ns/solid/terms#oidcIssuer');

    // Throw an error if there's no OIDC Issuer registered in the user's profile.
    if(!issuers || issuers.length === 0) {

      throw new Error(`No OIDC issuer for WebID: ${webId}`);

    }

    // Check if the issuers are valid OIDC providers.

    const validationResults = await Promise.all(issuers.map(this.validateIssuer));

    const validIssuers = issuers.filter((issuer, index) => validationResults[index]);

    if (!validIssuers || validIssuers.length === 0) { throw new Error(`No valid OIDC issuers for WebID: ${webId}`); }

    return Promise.all(validIssuers.map((iss) => {

      const url = new URL(iss).host.split('.');
      let description = (url.length > 2 ? url[1] : url[0]).split(':')[0];
      description = description.charAt(0).toUpperCase() + description.slice(1);

      const favicon = iss.endsWith('/') ? `${iss}favicon.ico` : `${iss}/favicon.ico`;

      return fetch(favicon).then((response) => {

        const icon = response.status === 200 ? favicon : 'https://www.donkey.bike/wp-content/uploads/2020/12/user-member-avatar-face-profile-icon-vector-22965342-300x300.jpg';

        return { uri: iss, icon, description };

      });

    }));

  }

  /**
   * Handles the post-login logic, as well as the restoration
   * of sessions on page refreshes
   */
  async getSession(): Promise<Session> {

    const session = await handleIncomingRedirect({ restorePreviousSession: true });

    return session && session.isLoggedIn ? { webId: session.webId } : Promise.reject();

  }

  /**
   * Redirects the user to their OIDC provider
   */
  async login(webId: string): Promise<void> {

    if (!webId) {

      throw new Error(`WebId should be set.: ${webId}`);

    }

    const issuer = await this.getIssuer(webId);

    if (!issuer) {

      throw new Error(`Issuer should be set.: ${issuer}`);

    }

    await login({
      oidcIssuer: issuer.uri,
      redirectUrl: window.location.href,
      clientName: this.clientName,
    });

  }

  /**
   * Redirects the user to their OIDC provider
   */
  async loginWithIssuer(webId: string, issuer: Issuer): Promise<void> {

    if (!webId) {

      throw new Error(`WebId should be set.: ${webId}`);

    }

    if (!issuer) {

      throw new Error(`Issuer should be set.: ${issuer}`);

    }

    await login({
      oidcIssuer: issuer.uri,
      redirectUrl: window.location.href,
      clientName: this.clientName,
    });

  }

  /**
   * Deauthenticates the user from their OIDC issuer
   */
  async logout(): Promise<void> {

    return await logout();

  }

  /**
   * Retrieves the profile for the given WebID.
   *
   * @param webId The WebID for which to retrieve the profile.
   */
  async getProfile(webId: string): Promise<Profile> {

    const profile = await this.profileThing(webId);

    const name = getStringNoLocale(profile, 'http://xmlns.com/foaf/0.1/name');

    return { uri: webId, name };

  }

  private async profileThing(webId: string): Promise<Thing> {

    if (!webId) {

      throw new Error(`WebId must be defined.`);

    }

    // Parse the user's WebID as a url.
    try {

      new URL(webId);

    } catch {

      throw new Error(`Invalid WebId: ${webId}`);

    }

    let profileDataset;

    // Dereference the user's WebID to get the user's profile document.
    try {

      profileDataset = await getSolidDataset(webId);

    } catch(e) {

      throw new Error(`No profile for WebId: ${webId}`);

    }

    if(!profileDataset) {

      throw new Error(`Could not read profile for WebId: ${webId}`);

    }

    // Parses the profile document.
    const profile = getThing(profileDataset, webId);

    if(!profile) {

      throw new Error(`No profile info for WebId: ${webId}`);

    }

    return profile;

  }

}
