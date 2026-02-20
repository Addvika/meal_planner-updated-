import { Entity, PrimaryGeneratedColumn, Column, OneToMany,Index} from "typeorm";
import { RecipeIngredient } from "./RecipeIngredient";
import type {Relation} from "typeorm";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column("varchar")
  name!: string;

  @Column("numeric", { nullable: true })
  cookingTime!: number; // in minutes

  // One Recipe has many RecipeIngredients
  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true, eager: true })
  recipeIngredients!: Relation<RecipeIngredient[]>;
}
