import { Router } from "express";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

export function registerUserRoutes(router: Router) {
  const repository = new UserRepository();
  const service = new UserService(repository);
  const controller = new UserController(service);

  // GET /api/usuarios?rol=ADMIN&nombre=juan&sort=nombre:asc&page=1&limit=10
  router.get("/usuarios", controller.list);

  // GET /api/usuarios/:id
  router.get("/usuarios/:id", controller.getById);

  // POST /api/usuarios
  router.post("/usuarios", controller.create);

  // PUT /api/usuarios/:id
  router.put("/usuarios/:id", controller.update);

  // DELETE /api/usuarios/:id
  router.delete("/usuarios/:id", controller.delete);
}
