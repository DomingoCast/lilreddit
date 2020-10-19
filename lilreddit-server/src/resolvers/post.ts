import { Resolver, Query, Mutation, Ctx, Arg, Int } from "type-graphql"
import {Post } from '../entities/Post'
import {MyContext} from '../types'

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {})
    }

    @Query(() => Post, {nullable: true})
    post(
        @Ctx() { em }: MyContext,
        @Arg('id', () => Int) id: number
    ): Promise<Post | null> { 
        return em.findOne(Post, {id})
    }

    @Mutation(() => Post)
    async createPost(
        @Ctx() { em }: MyContext,
        @Arg('title') title: string //No pongo graphql type porque lo infiere
    ): Promise<Post> { 
        const newPost = em.create(Post, { title })
        await em.persistAndFlush(newPost)
        return newPost
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string, //si quieres poner nullable tines que poner type
        @Ctx() { em }: MyContext
    ): Promise<Post | null> { 
        const post = await em.findOne(Post, {id})
        if(!post) return null
        if(typeof title !== "undefined"){
            post.title = title
            em.persistAndFlush(post)
        }
        
        await em.persistAndFlush(post)
        return post
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> { 
        await em.nativeDelete(Post, {id})
        return true
    }
}
