import { Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) => (value as Date).toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => (value as Date).toISOString())
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
