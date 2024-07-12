import type { Role, User } from "@prisma/client";

export type UserDTO = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  role: Role;
};

export abstract class UserDTOMapper {
  public static fromUser(
    user: User & {
      fullName: string;
    },
  ): UserDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      role: user.role,
    };
  }

  public static fromUsers(
    users: (User & {
      fullName: string;
    })[],
  ): UserDTO[] {
    return users.map(this.fromUser);
  }
}
