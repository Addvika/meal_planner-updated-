import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column,Index} from "typeorm";
import { Recipe } from "./Recipe";
import type {Relation} from "typeorm";
import { Ingredient } from "./Ingredient";

@Entity()
export class RecipeIngredient {
  @Index(["recipeId"]) 
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal")
  quantity!: number; // amount of ingredient in the recipe

  // Many RecipeIngredients belong to one Recipe
 /* @ManyToOne(() => Recipe, recipe => recipe.recipeIngredients, { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipeId" })
  recipe!: Recipe;
*/
 @ManyToOne("Recipe", "recipeIngredients", { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipeId" })
  recipe!: Relation<Recipe>; // Use Relation<> wrapper

  @ManyToOne("Ingredient", "recipeIngredients", { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: "ingredientId" })
  ingredient!: Relation<Ingredient>;
}
