import DB from '@app/config/db';
import { Item } from '@app/typings/item.interface';

/**
 * Singleton
 * @class
 * Handler for different routes
 */
class CollectionHandler {
  private static _instance: CollectionHandler;
  private constructor() {}

  public static getInstance(): CollectionHandler {
    if (!CollectionHandler._instance) {
      CollectionHandler._instance = new CollectionHandler();
    }
    return CollectionHandler._instance;
  }
  /**
   *
   * @param collection
   * @param limit
   * @returns
   */
  public async getAll(collection: string, limit: any) {
    try {
      const data = await DB.readMany(
        {
          collection: collection,
        },
        {},
        limit,
      );

      return {
        status: 200,
        code: 'Data Fetched',
        message: 'Data Fetched',
        data: data,
      };
    } catch (e) {
      return {
        status: 400,
        code: 'Bad Request',
        message: 'Bad Request',
      };
    }
  }
  /**
   *
   * @param collection
   * @param id
   * @returns
   */
  public async getDocumentByID(collection: string, id: string) {
    try {
      const data = await DB.readOne({
        collection: collection,
        id: id,
      });

      return {
        status: 200,
        code: 'Data Fetched',
        message: 'Data Fetched',
        data: data,
      };
    } catch (e) {
      return {
        status: 400,
        code: 'Bad Request',
        message: 'Bad Request',
      };
    }
  }
  /**
   *
   * @param collection
   * @param id
   * @param document
   * @returns
   */
  public async createNewDocument(collection: string, id: string, document: Partial<Item>) {
    try {
      const data = await DB.write(
        {
          collection: collection,
          id: id,
        },
        {
          ...document,
        },
      );
      console.log('Data written is', data);

      return {
        status: 200,
        code: 'ClientUpdated',
        message: 'Client updated',
      };
    } catch (e) {
      console.log(e);
      return {
        status: 400,
        code: 'Bad Request',
        message: 'Bad Request',
      };
    }
  }
  /**
   *
   * @param collection
   * @param id
   * @param document
   * @returns
   */
  public async updateDocument(collection: string, id: string, document: Partial<Item>) {
    try {
      const data = await DB.write(
        {
          collection: collection,
          id: id,
        },
        document,
      );
      console.log('Data updated is', data);
      return {
        status: 200,
        code: 'DataUpdated',
        message: 'Data updated',
      };
    } catch (e) {
      return {
        status: 400,
        code: 'Bad Request',
        message: 'Bad Request',
      };
    }
  }
}

export default CollectionHandler.getInstance();
