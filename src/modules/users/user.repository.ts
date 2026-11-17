import { Prisma, Rol, Usuario } from "@prisma/client";
import { prisma } from "../../infra/prisma";

export interface UserFilters {
  nombre?: string;
  rol?: Rol;
  page?: number;
  limit?: number;
  sort?: string; // ej: "nombre:asc"
}

export interface CreateUserDTO {
  nombre: string;
  email: string;
  rol: Rol;
  departamentoId?: number;
  bio?: string; // para el perfil
}

export interface UpdateUserDTO {
  nombre?: string;
  email?: string;
  rol?: Rol;
  departamentoId?: number | null;
  bio?: string | null;
}

export interface IUserRepository {
  findAll(filters: UserFilters): Promise<Usuario[]>;
  findById(id: number): Promise<Usuario | null>;
  create(data: CreateUserDTO): Promise<Usuario>;
  update(id: number, data: UpdateUserDTO): Promise<Usuario>;
  delete(id: number): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async findAll(filters: UserFilters): Promise<Usuario[]> {
    const { nombre, rol, page = 1, limit = 10, sort } = filters;

    const where: Prisma.UsuarioWhereInput = {};

    if (nombre) {
      where.nombre = { contains: nombre, mode: "insensitive" };
    }

    if (rol) {
      where.rol = rol;
    }

    const orderBy: Prisma.UsuarioOrderByWithRelationInput[] = [];

    if (sort) {
      const [field, direction] = sort.split(":");
      if (field && (direction === "asc" || direction === "desc")) {
        orderBy.push({ [field]: direction } as any);
      }
    } else {
      orderBy.push({ createdAt: "desc" });
    }

    const skip = (page - 1) * limit;

    return prisma.usuario.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        departamento: true,
        perfil: true
      }
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        departamento: true,
        perfil: true
      }
    });
  }

  /**
   * 🚀 TRANSACCIÓN: crea Usuario + Perfil de forma atómica
   */
  async create(data: CreateUserDTO): Promise<Usuario> {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.usuario.create({
        data: {
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          departamentoId: data.departamentoId
        }
      });

      if (data.bio) {
        await tx.perfil.create({
          data: {
            bio: data.bio,
            usuarioId: user.id
          }
        });
      }

      return user;
    });

    return result;
  }

  async update(id: number, data: UpdateUserDTO): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        departamentoId: data.departamentoId ?? undefined,
        perfil:
          data.bio !== undefined
            ? {
                upsert: {
                  create: { bio: data.bio ?? undefined },
                  update: { bio: data.bio }
                }
              }
            : undefined
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.perfil.deleteMany({ where: { usuarioId: id } });
      await tx.usuario.delete({ where: { id } });
    });
  }
}
