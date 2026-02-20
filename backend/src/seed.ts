import { AppDataSource } from "./data-source.js";
import { Recipe } from "./entities/Recipe.js";
import { Ingredient } from "./entities/Ingredient.js";
import { RecipeIngredient } from "./entities/RecipeIngredient.js";
import { faker } from "@faker-js/faker";

const seed = async () => {
  try {
    await AppDataSource.initialize();
    
    // Clear the database to start fresh
    await AppDataSource.synchronize(true);

    // 1. Create 50 unique Ingredients
    const ingredientRepo = AppDataSource.getRepository(Ingredient);
    const ingredientsData = [];
    
    for (let i = 0; i < 50; i++) {
      ingredientsData.push({
        name: faker.food.ingredient(),
        // Use faker.number to create a realistic calorie range per 100g
        caloriesPerUnit: faker.number.int({ min: 20, max: 600 }) 
      });
    }
    const savedIngredients = await ingredientRepo.save(ingredientsData);

    // 2. Create 110 Recipes (Requirement: 100+)
    const recipeRepo = AppDataSource.getRepository(Recipe);
    const recipeIngRepo = AppDataSource.getRepository(RecipeIngredient);

    for (let i = 0; i < 110; i++) {
      const recipe = await recipeRepo.save({
        name: faker.food.dish(),
        cookingTime: faker.number.int({ min: 5, max: 120 })
      });

      // 3. Attach 3-6 random ingredients to each recipe
      const recipeIngredients = [];
      const numIngredients = faker.number.int({ min: 3, max: 6 });

      for (let j = 0; j < numIngredients; j++) {
        const randomIng = savedIngredients[Math.floor(Math.random() * savedIngredients.length)];
        
        recipeIngredients.push({
          recipe: recipe,
          ingredient: randomIng,
          quantity: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 })
        });
      }
      await recipeIngRepo.save(recipeIngredients);
    }

    console.log("✅ Successfully seeded 110 recipes with ingredients!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
};

seed();