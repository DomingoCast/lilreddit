import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants"
import { Post } from "./entities/Post"
import microConfig from "./mikro-orm.config"

const main = async () => {
    const orm = await MikroORM.init(microConfig);

    await orm.getMigrator().up() //make migration

    //const post = orm.em.create(Post, {title: "My first post"}) //Create post
    //await orm.em.persistAndFlush(post) //Introducir post a database

    //const posts = await orm.em.find(Post, {})
    //console.log(posts)
}


main().catch(err => console.error(err));
//kf
