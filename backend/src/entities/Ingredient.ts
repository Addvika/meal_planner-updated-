import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient.ts";

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("numeric", { nullable: true })
  costPerUnit!: number;

  @Column("numeric", { nullable: true })
  caloriesPerUnit!: number;

  @OneToMany(() => RecipeIngredient, ri => ri.ingredient) // <-- Use clean syntax
recipeIngredients!: RecipeIngredient[];

}
