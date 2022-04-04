import { Request, Response, NextFunction } from "express";
function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  // period default to 5 minutes: 60 secs * 5
  const period = 60 * 5;

  // you only want to cache for GET requests
  if (req.method == "GET") {
    res.set("Cache-control", `public, max-age=${period}`);
  } else {
    // for the other requests set strict no caching parameters
    res.set("Cache-control", `no-store`);
  }

  next();
}

export default cacheMiddleware;
