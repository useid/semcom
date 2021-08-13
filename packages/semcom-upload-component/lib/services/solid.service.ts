import { Session } from '../models/session.model';
import { Profile } from '../models/profile.model';
import { Issuer } from '../models/issuer.model';

// Taken from UI-transfer. Included here because importing fetch from ui-transfer (which is imported from inrupt)
// does not work for an unknown reason.

/**
 * Service for interacting with Solid pods
 */
export interface SolidService {

  /**
   * Retrieves the value of a single oidcIssuer triple from a profile document
   * for a given WebID
   *
   * @param webId The WebID for which to retrieve the OIDC issuer
   */
  getIssuer(webId: string): Promise<Issuer>;

  /**
   * Retrieves the value of the oidcIssuer triples from a profile document
   * for a given WebID
   *
   * @param webId The WebID for which to retrieve the OIDC issuers
   */
  getIssuers(webId: string): Promise<Issuer[]>;

  /**
   * Handles the post-login logic, as well as the restoration
   * of sessions on page refreshes
   */
  getSession(): Promise<Session>;

  /**
   * Redirects the user to their OIDC provider
   */
  login(webId: string): Promise<void>;

  /**
   * Redirects the user to their OIDC provider
   */
  loginWithIssuer(webId: string, issuer: Issuer): Promise<void>;

  /**
   * Deauthenticates the user from their OIDC issuer
   */
  logout(): Promise<void>;

  /**
   * Retrieves the profile for the given WebID.
   *
   * @param webId The WebID for which to retrieve the profile.
   */
  getProfile(webId: string): Promise<Profile>;

}
