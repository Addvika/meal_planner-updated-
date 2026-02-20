import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.ts"; // adjust if you have more entities
import { Recipe } from "./entities/Recipe.ts";
import { Ingredient } from "./entities/Ingredient.ts";
import { RecipeIngredient } from "./entities/RecipeIngredient.ts";
export const AppDataSource = new DataSource({
    type: "type",
    host: "host",
    port: port,
    username: "user_name",      // change if needed
    password: "password",      // change if needed
    database: "database",          // your database
    synchronize: true,         
    logging: ["error","query", "schema"],
    entities: [entities],
    migrations:[],
    subscribers: [],
});
