import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field } from 'type-graphql'

@ObjectType() //Make it a graphql type
@Entity()
export class Post {

  @Field() //Ensenyar para graphql schema
  @PrimaryKey()
  id!: number;

  @Field(() => String) //poner type
  @Property({type: "date"})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({type: "text"})
  title!: string;

}


