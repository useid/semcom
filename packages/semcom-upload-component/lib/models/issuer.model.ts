// Taken from UI-transfer. Included here because importing fetch from ui-transfer (which is imported from inrupt)
// does not work without these models and services for an unknown reason.
export interface Issuer {
  icon: string;
  description: string;
  uri: string;
}
