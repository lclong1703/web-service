import { User as UserDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserConverter {
  toEntity(dto: UserDto) {
    const entity = new User();
    entity.email = dto.email;
    return entity;
  }

  toDto(entity: User) {
    const dto = {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      status: entity.status,
    } as UserDto;

    return dto;
  }
}
