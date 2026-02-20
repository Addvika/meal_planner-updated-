// src/CreateRecipe.ts
import { AppDataSource } from "./data-source.ts";
import { Recipe } from "./entities/Recipe.ts";
import { Ingredient } from "./entities/Ingredient.ts";
import { RecipeIngredient } from "./entities/RecipeIngredient.ts"; // <--- 1. IMPORT JUNCTION ENTITY

async function main() {
   try {
   await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

 const recipeRepo = AppDataSource.getRepository(Recipe);
 const ingredientRepo = AppDataSource.getRepository(Ingredient);
 const riRepo = AppDataSource.getRepository(RecipeIngredient); // <--- Get Junction Repository

 // --- 1. Create or fetch Ingredients ---
 console.log("Creating/Fetching Ingredients...");
const tomato = ingredientRepo.create({ 
 name: "Tomato", 
 costPerUnit: 0.50, // Assuming unit price
caloriesPerUnit: 20 // Assuming calories
});
 const pasta = ingredientRepo.create({  name: "Pasta", 
 costPerUnit: 1.50, 
caloriesPerUnit: 150 
 });

 // Save ingredients first to ensure they have IDs
 await ingredientRepo.save([tomato, pasta]);

// --- 2. Create the main Recipe ---
console.log("Creating Recipe object...");
 const recipe = recipeRepo.create({
name: "Quick Tomato Pasta",
 cookingTime: 30,
 // recipeIngredients will be set next
 });

 // --- 3. Create the Junction entities (RecipeIngredient) ---
 console.log("Creating Junction Entities...");
 const riTomato = riRepo.create({
 recipe: recipe,         // Link the Recipe instance
 ingredient: tomato,     // Link the Ingredient instance
quantity: 400,          // 400 grams of tomato
 });

 const riPasta = riRepo.create({
 recipe: recipe,
 ingredient: pasta,
 quantity: 150,          // 150 grams of pasta
});

 // --- 4. Link the junction entities back to the Recipe ---
 recipe.recipeIngredients = [riTomato, riPasta];

 // --- 5. Save the Recipe (cascade: true ensures RIs are saved too) ---
 await recipeRepo.save(recipe);

 console.log("✅ Successfully Created Recipe with ingredients:", recipe);

// --- 6. Fetch recipe with ingredients to confirm relations are loaded ---
 const savedRecipe = await recipeRepo.findOne({
where: { id: recipe.id },
 // Since eager: true is on recipeIngredients, you may not need to specify relations here,
// but explicitly defining them ensures nested ingredients are loaded
relations: {
 recipeIngredients: {
 ingredient: true,
 },
 },
});

console.log("Fetched recipe with ingredients:", JSON.stringify(savedRecipe, null, 2));

await AppDataSource.destroy();
console.log("Data Source destroyed.");
} catch (err) {
 console.error("Error creating recipe:", err);
 }
}

main(); // Note: Removed .catch, as the try/catch inside main() is cleaner.