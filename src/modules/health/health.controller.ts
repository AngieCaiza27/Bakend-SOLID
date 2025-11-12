import { Request, Response, NextFunction } from "express";
import { IHealthService } from "./health.service";

export class HealthController {
  constructor(private readonly service: IHealthService) {}

  getHealth = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getStatus();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}
