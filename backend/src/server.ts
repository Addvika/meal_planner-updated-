// src/server.ts

import "reflect-metadata"; // Required by TypeORM and decorators
import express from "express";

// Import Route Handlers
import recipeRoutes from "./routes/recipe_routes.ts";
import ingredientRoutes from "./routes/ingredient_routes.ts";
import calorieRoutes from "./routes/calorie_routes.ts";

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());
// FIX: Add a simple root route handler
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Meal Planner API is running successfully!",
        status: "OK",
        available_routes: ["/api/recipes", "/api/ingredients", "/api/calories"] 
    });
});
/**
 * Initializes the TypeORM Data Source and starts the Express server.
 */
async function initializeAndStartServer() {
    try {
        // 1. LAZY LOAD THE DATA SOURCE
        // Using await import() breaks any potential synchronous dependency cycle with entities.
        const { AppDataSource } = await import("./data-source.ts");

        // 2. Initialize TypeORM
        await AppDataSource.initialize();
        console.log("✅ Data Source has been initialized!");

        // 3. Register Routes
        app.use("/api/ingredients", ingredientRoutes); // Note: Added base path for clarity
        app.use("/api/recipes", recipeRoutes);         // Note: Added base path for clarity
        app.use("/api/calories", calorieRoutes);

        // 4. Start the Express server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        // Log detailed error information before exiting
        console.error("🔥 FATAL ERROR DURING SERVER STARTUP:");
        if (err instanceof Error) {
            console.error("Error Name:", err.name);
            console.error("Error Message:", err.message);
            // console.error("Stack Trace:", err.stack); // Uncomment for more debugging
        } else {
            console.error("Unknown Error:", err);
        }
        process.exit(1); // Exit the process on failure
    }
}

// Execute the main initialization function
initializeAndStartServer();