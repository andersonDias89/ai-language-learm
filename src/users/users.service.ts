import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { IUserService, IUser, ICreateUser, IUpdateUser } from './types/user.types';

@Injectable()
export class UsersService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(data: ICreateUser): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    return this.userRepository.create(data);
  }

  async update(id: string, data: IUpdateUser): Promise<IUser> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.delete(id);
  }
}
