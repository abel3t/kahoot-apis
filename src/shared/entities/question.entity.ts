import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { getUnixTime } from 'date-fns';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { BaseEntity, IBaseEntity } from './base.entity';

interface IQuestion extends IBaseEntity {
  title?: string;
  type?: string;
  answers?: Answer[];
  photo?: string;
}

class Answer {
  @Field()
  @Column({ type: 'varchar', width: 1024 })
  title: string;

  @Field()
  @Column({ type: 'varchar', width: 64 })
  type: string;
}

@ObjectType()
@InputType('question')
@Entity('Question')
export class Question extends BaseEntity {
  constructor(props?: IQuestion) {
    const { title, type, answers, photo, ...superItem } = props || {};

    super(superItem);

    Object.assign(this, { title, type, answers, photo });
  }

  @Field()
  @Column({ type: 'varchar', width: 1024, nullable: true })
  title?: string;

  @Field()
  @Column({ type: 'varchar', width: 64 })
  type: string;

  @Field(() => [Answer])
  @Column({ type: 'varchar', width: 64 })
  answers: Answer[];

  @Field()
  @Column({ type: 'varchar', width: 256, nullable: true })
  photo?: string;

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
