import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: JSON.parse(error.message) });
      } else {
        res.status(400).json({ message: 'Invalid request' });
      }
    }
  };
};

export default validateRequest;
