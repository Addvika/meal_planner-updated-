import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient";

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column("varchar")
  name!: string;

  @Index()
  @Column("numeric", { nullable: true })
  costPerUnit!: number;

  @Index()
  @Column("numeric", { nullable: true })
  caloriesPerUnit!: number;

  @OneToMany(() => RecipeIngredient, ri => ri.ingredient) // <-- Use clean syntax
recipeIngredients!: RecipeIngredient[];

}
