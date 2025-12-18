import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

// Generic validation middleware factory
export const validate = (schema: z.ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      let data: any;
      
      switch (source) {
        case 'body':
          data = req.body;
          break;
        case 'query':
          data = req.query;
          break;
        case 'params':
          data = req.params;
          break;
      }

      const validated = schema.parse(data);
      
      // Replace the original data with validated data
      switch (source) {
        case 'body':
          req.body = validated;
          break;
        case 'query':
          req.query = validated as any;
          break;
        case 'params':
          req.params = validated as any;
          break;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      } else {
        next(error);
      }
    }
  };
};

// Convenience functions for different validation sources
export const validateBody = (schema: z.ZodSchema) => validate(schema, 'body');
export const validateQuery = (schema: z.ZodSchema) => validate(schema, 'query');
export const validateParams = (schema: z.ZodSchema) => validate(schema, 'params');


