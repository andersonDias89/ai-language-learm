import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedPassword',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(jest.mocked(repository.findAll)).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
      expect(jest.mocked(repository.findById)).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
      expect(jest.mocked(repository.findById)).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      const mockUser = {
        id: '1',
        ...createUserData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockResolvedValue(mockUser);

      const result = await service.create(createUserData);
      expect(result).toEqual(mockUser);
      expect(jest.mocked(repository.findByEmail)).toHaveBeenCalled();
      expect(jest.mocked(repository.create)).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      const existingUser = {
        id: '1',
        ...createUserData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(existingUser);

      await expect(service.create(createUserData)).rejects.toThrow(
        ConflictException,
      );
      expect(jest.mocked(repository.findByEmail)).toHaveBeenCalled();
    });
  });
});
