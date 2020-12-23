
import { User } from "../entities/User";
import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, ObjectType} from "type-graphql";
import { MyContext } from "../types"
import argon2 from "argon2"

@InputType()
class UsernamePasswordIntput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users( @Ctx() {em}: MyContext ): Promise<User[]>{
        return  em.find(User, {});
    }

    @Mutation(() => UserResponse)
    async register( 
        @Arg("options") options: UsernamePasswordIntput,
        @Ctx() {em}: MyContext 
        ): Promise<UserResponse>{
            console.log(options)
            if(!options.username || !options.password)
                return {
                    errors: [{
                        field: 'input',
                        message: 'cannot leave blank'
                    }]
                };
            
            const hashPsw = await argon2.hash(options.password)
            const user = em.create(User, {username: options.username, password: hashPsw})
            try{
                await em.persistAndFlush(user)
            } catch (err) {
                console.log(err.message)
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already exists'
                    }]
                };
            }
        return  {user};
    }

    @Mutation(() => UserResponse)
    async login( 
        @Arg("options") options: UsernamePasswordIntput,
        @Ctx() {em}: MyContext 
        ): Promise<UserResponse>{
            const user = await em.findOne(User, {username: options.username})
            if(!user){
                return {
                    errors: [{
                        field: 'username',
                        message: 'the username doesn\'t exist'
                    }]
                }
            }
            const valid = await argon2.verify(user.password, options.password)
            if(!valid) {
                return {
                    errors: [{
                        field: 'password',
                        message: 'wrong password'
                    }]
                }

            }

        return {user };
    }
}