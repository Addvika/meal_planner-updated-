import { Router } from "express";
import { AppDataSource } from "../data-source.ts";
import { Ingredient } from "../entities/Ingredient.ts";

const router = Router();

/**
 * CREATE ingredient
 * POST /ingredients
 */
router.post("/", async (req, res) => {
  try {
    const { name, caloriesPerUnit, costPerUnit } = req.body;

    if (!name || caloriesPerUnit == null || costPerUnit == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const repo = AppDataSource.getRepository(Ingredient);

    const ingredient = repo.create({
      name,
      caloriesPerUnit,
      costPerUnit,
    });

    await repo.save(ingredient);
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ error: "Failed to create ingredient" });
  }
});

/**
 * GET all ingredients
 * GET /ingredients
 */
router.get("/", async (_req, res) => {
  const repo = AppDataSource.getRepository(Ingredient);
  const ingredients = await repo.find();
  res.json(ingredients);
});

/**
 * GET ingredient by id
 * GET /ingredients/:id
 */
router.get("/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Ingredient);
  const ingredient = await repo.findOneBy({
    id: Number(req.params.id),
  });

  if (!ingredient) {
    return res.status(404).json({ error: "Ingredient not found" });
  }

  res.json(ingredient);
});

/**
 * UPDATE ingredient
 * PUT /ingredients/:id
 */
router.put("/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Ingredient);
  const ingredient = await repo.findOneBy({
    id: Number(req.params.id),
  });

  if (!ingredient) {
    return res.status(404).json({ error: "Ingredient not found" });
  }

  repo.merge(ingredient, req.body);
  await repo.save(ingredient);
  res.json(ingredient);
});

/**
 * DELETE ingredient
 * DELETE /ingredients/:id
 */
router.delete("/:id", async (req, res) => {
  const repo = AppDataSource.getRepository(Ingredient);
  await repo.delete(req.params.id);
  res.status(204).send();
});

export default router;
