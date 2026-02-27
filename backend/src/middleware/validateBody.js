import { ZodError } from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body ?? {});
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      return next(error);
    }
  };
}
