import { ErrorRequestHandler, RequestHandler } from "express";

export const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      type: err.constructor.name,
      message: err.message,
    });
  }

  res.status(500).json({
    type: err.constructor.name,
    message: err.toString(),
  });
}


export const errorChecked = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  }
}

export class NotFoundError extends Error {
  constructor(public model: string, public id: number) {
    super(`ID ${id} for model ${model} not found.`);
  }
}
