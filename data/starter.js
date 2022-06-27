// Used to seed the DB with fresh data
const seedNewData = async (storage) => {
  const IngredientModel = require("../models/ingredientModel");
  const InventoryModel = require("../models/inventoryModel");
  const RecipeModel = require("../models/recipeModel");

  const { Sequelize } = require('sequelize');
  const initializeModels = require('../models/model');

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storage,
    logging: false
  });

  const models = initializeModels(sequelize, { 'force': true });
  const ingredientModel = new IngredientModel(models);
  const inventoryModel = new InventoryModel(models);
  const recipeModel = new RecipeModel(models);

  console.log(`Starting to seed new data in ${storage}`);

  const fs = require('fs');
  let rawdata = fs.readFileSync('/data/seed.json');
  let data = JSON.parse(rawdata);

  console.log('New data: ');
  console.log(JSON.stringify(data, null, 2));

  console.log('Adding ingredients...');
  const ingredient = data.ingredient;
  const ingredientResult = Promise.all(ingredient.map(i => ingredientModel.add(i.name, i.units)));
  await ingredientResult;

  const allIngredient = await ingredientModel.get();
  console.log(`Finished adding ${allIngredient.length} ingredients!`);

  console.log('Adding items to inventory...');
  const inventory = data.inventory;
  const inventoryResult = Promise.all(inventory.map(i => inventoryModel.add(i.ingredientId, i.amount)));
  await inventoryResult;

  const allInventory = await inventoryModel.get();
  console.log(`Finished adding ${allInventory.length} items to inventory!`);

  console.log('Adding new recipes...');
  const recipe = data.recipe;
  const recipeResult = Promise.all(recipe.map(async r => {
    const createdRecipe = await recipeModel.add(r.name);

    const result = Promise.all(r.ingredients.map(i => {
      recipeModel.addIngredient(createdRecipe.id, i.ingredientId, i.amount);
    }))

    return result;
  }))
  await recipeResult;

  const allRecipe = await recipeModel.get();
  console.log(`Finished adding ${allRecipe.length} recipes!`);
}

seedNewData('data/db.sqlite');