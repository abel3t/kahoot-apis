import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { getUnixTime } from 'date-fns';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { BaseEntity, IBaseEntity } from './base.entity';

interface IRoom extends IBaseEntity {
  name?: string;
  code?: number;
  type?: string;
}

@ObjectType()
@InputType('room')
@Entity('Room')
export class User extends BaseEntity {
  constructor(props?: IRoom) {
    const { name, code, type, ...superItem } = props || {};

    super(superItem);

    Object.assign(this, { name, code, type });
  }

  @Field()
  @Column({ type: 'varchar', width: 128, nullable: true })
  name?: string;

  @Field()
  @Column({ type: 'varchar', width: 64 })
  type: string;

  @Field()
  @Column({ width: 256 })
  code?: number;

  @BeforeInsert()
  init(): void {
    this.isActive = true;
    this.createdAt = getUnixTime(new Date());
  }

  @BeforeUpdate()
  update(): void {
    this.updatedAt = getUnixTime(new Date());
  }
}
