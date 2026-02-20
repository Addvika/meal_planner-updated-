import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient.ts";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("numeric", { nullable: true })
  cookingTime!: number; // in minutes

  // One Recipe has many RecipeIngredients
  @OneToMany(() => RecipeIngredient, ri => ri.recipe, { cascade: true ,eager:true})
  recipeIngredients!: RecipeIngredient[];
}
