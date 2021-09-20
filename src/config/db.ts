import Database from 'database-package';
import * as serviceAccount from '@app/config/service_account.json';
import * as dotenv from 'dotenv';

dotenv.config();
interface Params {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientC509CertUrl: string;
}

const serviceParams: Params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};
/**
 * Singleton
 * Wrapper class over database-package
 * @class
 * 
 */
class DB {
  private static _database_instance: Database;

  private constructor() {}

  public static getInstance(cacheMaxAge: number, cacheAllocatedMemory: number): Database {
    if (!DB._database_instance) {
      DB._database_instance = new Database({
        cacheMaxAge: cacheMaxAge,
        cacheAllocatedMemory: cacheAllocatedMemory,
        serviceParams,
      });
    }
    return DB._database_instance;
  }
}

export default DB.getInstance(
  parseInt(process.env.LOCAL_CACHE_TTL as string) || 3600,
  parseInt(process.env.MAX_CACHE as string) || 64,
);
