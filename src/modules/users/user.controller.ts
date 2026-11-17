import { Request, Response, NextFunction } from "express";
import { Rol } from "@prisma/client";
import { IUserService } from "./user.service";

export class UserController {
  constructor(private readonly service: IUserService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre, rol, page, limit, sort } = req.query;

      const users = await this.service.list({
        nombre: nombre as string | undefined,
        rol: rol as Rol | undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sort: sort as string | undefined
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await this.service.getById(id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre, email, rol, departamentoId, bio } = req.body;

      const user = await this.service.create({
        nombre,
        email,
        rol,
        departamentoId,
        bio
      });

      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { nombre, email, rol, departamentoId, bio } = req.body;

      const user = await this.service.update(id, {
        nombre,
        email,
        rol,
        departamentoId,
        bio
      });

      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.service.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
