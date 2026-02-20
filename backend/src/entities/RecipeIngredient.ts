import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Recipe } from "./Recipe.ts";
import { Ingredient } from "./Ingredient.ts";

@Entity()
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal")
  quantity!: number; // amount of ingredient in the recipe

  // Many RecipeIngredients belong to one Recipe
 /* @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipeId" })
  recipe!: Recipe;
*/
  @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients, { onDelete: "CASCADE" }) // <-- Use clean syntax
@JoinColumn({ name: "recipeId" })
recipe!: Recipe; // <-- Use clean type
  @ManyToOne(() => Ingredient, ingredient => ingredient.recipeIngredients, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "ingredientId" })
  ingredient!: Ingredient;
}
