import * as dotenv from 'dotenv';
const { google } = require('googleapis');
const compute = google.compute('v1');
const servicekeyPath = require('app-root-path').resolve('/src/config/service_account.json');

dotenv.config();

if (
  !(
    process.env.GOOGLE_API_SCOPE &&
    process.env.GOOGLE_PROJECT &&
    process.env.GOOGLE_BACKEND_SERVICE &&
    process.env.GOOGLE_RESOURCE_GROUP
  )
) {
  process.exit(1);
}
/**
 * @class
 * Heath Check for backend service class
 * Singleton
 */
class GoogleApi {
  private static _instance: GoogleApi;
  private auth: any;
  private constructor() {
    this.auth = {};
  }

  public static getInstance(): GoogleApi {
    if (!GoogleApi._instance) {
      GoogleApi._instance = new GoogleApi();
    }
    return GoogleApi._instance;
  }

  public async getHealth() {
    try {
      this.auth = new google.auth.GoogleAuth({
        keyFile: servicekeyPath,
        scopes: [process.env.GOOGLE_API_SCOPE as string],
      });

      const request = {
        project: process.env.GOOGLE_PROJECT as string, 

        // Name of the BackendService resource to which the queried instance belongs.
        backendService: process.env.GOOGLE_BACKEND_SERVICE as string,

        resource: {
          // TODO: Add desired properties to the request body.
          group: process.env.GOOGLE_RESOURCE_GROUP as string,
        },

        auth: this.auth,
      };

      const result = compute.backendServices.getHealth(request);
      return result;
    } catch (error) {
      return Promise.reject({ error: { type: 'internal_server_error', message: 'Unable to get google client' } });
    }
  }
}

export default GoogleApi.getInstance();
