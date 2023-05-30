import { ErrorRequestHandler, RequestHandler } from "express";

export const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  switch (err.constructor) {
    case NotFoundError:
      return res.status(404).json({
        type: err.constructor.name,
        message: err.message,
      });
    default:
      console.error(err);
      return res.status(500).json({
        type: err.constructor.name,
        message: err.message || err.toString(),
      });
  }
}

export const errorChecked = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

export class NotFoundError extends Error {
  constructor(public model: string, public id: number) {
    super(`The record with ID ${id} of the model ${model} does not exist.`);
  }
}

