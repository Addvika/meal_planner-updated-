import { Router } from "express";
import { AppDataSource } from "../data-source.ts";
import { Recipe } from "../entities/Recipe.ts";
import { RecipeIngredient } from "../entities/RecipeIngredient.ts";
import { Ingredient } from "../entities/Ingredient.ts";

const router = Router();

/**
 * GET /calories/recipe/:id
 * Returns total calories for a recipe
 */
router.get("/recipe/:id", async (req, res) => {
  try {
    const recipeId = Number(req.params.id);

    const recipeRepo = AppDataSource.getRepository(Recipe);

    const recipe = await recipeRepo.findOne({
      where: { id: recipeId },
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const totalCalories = recipe.recipeIngredients.reduce(
      (sum, ri) => sum + ri.quantity * ri.ingredient.caloriesPerUnit,
      0
    );

    res.json({
      recipeId: recipe.id,
      recipeName: recipe.name,
      totalCalories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate calories" });
  }
});

/**
 * GET /calories/ingredient/:id
 * Returns calories per unit for an ingredient
 */
router.get("/ingredient/:id", async (req, res) => {
  try {
    const ingredientId = Number(req.params.id);

    const ingredient = await AppDataSource.getRepository(Ingredient).findOne({ // <-- Pass the class
  where: { id: ingredientId },
    });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    res.json({
      ingredientId: ingredient.id,
      name: ingredient.name,
      caloriesPerUnit: ingredient.caloriesPerUnit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ingredient calories" });
  }
});

/**
 * GET /calories/recipes
 * Returns calories for ALL recipes
 */
router.get("/recipes", async (_req, res) => {
  try {
    const recipeRepo = AppDataSource.getRepository(Recipe);

    const recipes = await recipeRepo.find({
      relations: {
        recipeIngredients: {
          ingredient: true,
        },
      },
    });

    const result = recipes.map((recipe) => {
      const totalCalories = recipe.recipeIngredients.reduce(
        (sum, ri) => sum + ri.quantity * ri.ingredient.caloriesPerUnit,
        0
      );

      return {
        recipeId: recipe.id,
        recipeName: recipe.name,
        totalCalories,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate calories" });
  }
});

export default router;
