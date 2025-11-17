import { Rol, Usuario } from "@prisma/client";
import {
  CreateUserDTO,
  IUserRepository,
  UpdateUserDTO,
  UserFilters
} from "./user.repository";

export interface IUserService {
  list(filters: UserFilters): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario>;
  create(data: CreateUserDTO): Promise<Usuario>;
  update(id: number, data: UpdateUserDTO): Promise<Usuario>;
  delete(id: number): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private readonly repository: IUserRepository) {}

  async list(filters: UserFilters): Promise<Usuario[]> {
    return this.repository.findAll(filters);
  }

  async getById(id: number): Promise<Usuario> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async create(data: CreateUserDTO): Promise<Usuario> {
    return this.repository.create(data);
  }

  async update(id: number, data: UpdateUserDTO): Promise<Usuario> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
