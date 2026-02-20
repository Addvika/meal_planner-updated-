import { Router } from "express";
import { AppDataSource } from "../data-source.ts";
import { Recipe } from "../entities/Recipe.ts";
import { Ingredient } from "../entities/Ingredient.ts";
import { RecipeIngredient } from "../entities/RecipeIngredient.ts";

const router = Router();

// 1. GET ALL RECIPES
router.get("/", async (req, res) => {
    try {
        const repo = AppDataSource.getRepository(Recipe);
        const recipes = await repo.find({
            relations: {
                recipeIngredients: {
                    ingredient: true,
                },
            },
        });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve recipes" });
    }
});

// 2. CREATE RECIPE
router.post("/", async (req, res) => {
    try {
        const { name, cookingTime } = req.body;
        const repo = AppDataSource.getRepository(Recipe);
        const recipe = repo.create({ name, cookingTime });
        await repo.save(recipe);
        res.status(201).json(recipe);
    } catch (error) {
        res.status(500).json({ error: "Failed to create recipe" });
    }
});

// 3. ADD INGREDIENT TO RECIPE
router.post("/:id/ingredients", async (req, res) => {
    try {
        const { ingredientId, quantity } = req.body;
        const recipeRepo = AppDataSource.getRepository(Recipe);
        const ingredientRepo = AppDataSource.getRepository(Ingredient);
        const riRepo = AppDataSource.getRepository(RecipeIngredient);

        const recipe = await recipeRepo.findOneBy({ id: Number(req.params.id) });
        const ingredient = await ingredientRepo.findOneBy({ id: Number(ingredientId) });

        if (!recipe || !ingredient) {
            return res.status(404).json({ error: "Recipe or ingredient not found" });
        }

        // Variable renamed from 'ri' to 'recipeIngredient' to avoid redeclaration conflicts
        const recipeIngredient = riRepo.create({
            recipe,
            ingredient,
            quantity,
        });

        await riRepo.save(recipeIngredient);
        res.status(201).json(recipeIngredient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to link ingredient" });
    }
});

// 4. GET SINGLE RECIPE WITH INGREDIENTS
router.get("/:id", async (req, res) => {
    try {
        const repo = AppDataSource.getRepository(Recipe);
        const recipe = await repo.findOne({
            where: { id: Number(req.params.id) },
            relations: {
                recipeIngredients: {
                    ingredient: true,
                },
            },
        });

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 5. SEARCH BY INGREDIENT NAME
router.get("/by-ingredient/:name", async (req, res) => {
    try {
        const recipes = await AppDataSource.getRepository(Recipe)
            .createQueryBuilder("recipe")
            .leftJoinAndSelect("recipe.recipeIngredients", "ri")
            .leftJoinAndSelect("ri.ingredient", "ingredient")
            .where("ingredient.name = :name", { name: req.params.name })
            .getMany();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
});

// 6. CALCULATE CALORIES
router.get("/:id/calories", async (req, res) => {
    try {
        const recipe = await AppDataSource.getRepository(Recipe).findOne({
            where: { id: Number(req.params.id) },
            relations: {
                recipeIngredients: {
                    ingredient: true,
                },
            },
        });

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        const totalCalories = recipe.recipeIngredients.reduce((acc, item) => {
            const calories = item.ingredient?.caloriesPerUnit || 0;
            return acc + (Number(item.quantity) * Number(calories));
        }, 0);

        res.json({
            recipeId: recipe.id,
            recipeName: recipe.name,
            totalCalories,
        });
    } catch (error) {
        res.status(500).json({ error: "Calorie calculation failed" });
    }
});

export default router;