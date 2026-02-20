import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.ts"; // adjust if you have more entities
import { Recipe } from "./entities/Recipe.ts";
import { Ingredient } from "./entities/Ingredient.ts";
import { RecipeIngredient } from "./entities/RecipeIngredient.ts";
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",      // change if needed
    password: "Adventure*21",      // change if needed
    database: "mydb",          // your database
    synchronize: true,         
    logging: ["error","query", "schema"],
    entities: [User,Recipe,Ingredient,RecipeIngredient],
    migrations:[],
    subscribers: [],
});
