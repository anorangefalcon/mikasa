import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    apiKey: string;
  };
}

export const verifyApiKey = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const apiKey = req.headers["x-api-key"] || req.query.api_key;

    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: "API key is required",
      });
      return;
    }

    const validApiKey = process.env.FALCON_API_KEY;

    if (apiKey !== validApiKey) {
      res.status(403).json({
        success: false,
        message: "Invalid API key",
      });
      return;
    }

    req.user = { apiKey: apiKey.toString() };
    next();
  } catch (error) {
    console.error("API Key verification error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
