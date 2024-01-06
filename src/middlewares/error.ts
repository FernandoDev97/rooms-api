import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../helpers/api-erros'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode ?? 500
  const message = error.statusCode ? error.message : 'Internal Server Error'
  return res.status(statusCode).json({ message })
}
