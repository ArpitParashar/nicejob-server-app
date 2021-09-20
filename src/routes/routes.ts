import express, { Request, Response } from 'express';
import { LIMIT } from '@app/constants/constants';
import CollectionHandler from '@app/handlers/collectionHandler';
import GoogleApi from '@app/services/googleApiService'

export const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  return res.status(200).send('Hello World!');
});

router.get('/health', async (req: Request, res: Response) => {
  const result = await GoogleApi.getHealth();
  if(result.status === 200) {
    return res.status(result.status).send({
      data: result.data
    });
  }
  else{ 
    return res.status(result.status).send({
      statusText: result.statusText
    });
  }
  
});

router.get('/:collection', async (req: Request, res: Response) => {
  const limit = req?.query?.limit || LIMIT;
  const result = await CollectionHandler.getAll(req.params.collection, limit);

  return res.status(result.status).send({
    ...result,
  });
});

router.get('/:collection/:id', async (req: Request, res: Response) => {
  const { collection, id } = req.params;
  const result = await CollectionHandler.getDocumentByID(collection, id);
  return res.status(result.status).send({
    ...result,
  });
});

router.post('/:collection', async (req: Request, res: Response) => {
  const document = req.body.document;
  const id = req.body.id;
  const collection = req.params.collection;

  const result = await CollectionHandler.createNewDocument(collection, id, document);

  return res.status(result.status).send({
    ...result,
  });
});

router.post('/:collection/:id', async (req: Request, res: Response) => {
  const { collection, id } = req.params;
  const document = req.body.document;

  const result = await CollectionHandler.updateDocument(collection, id, document);

  return res.status(result.status).send({
    ...result,
  });
});
