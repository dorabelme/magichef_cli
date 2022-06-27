#!/usr/bin/env node

const commander = require("commander");
const colors = require("colors");
const Ingredient = require("../commands/ingredient");
const IngredientModel = require("../models/ingredientModel");
const IngredientView = require("../views/ingredientView");
const Inventory = require("../commands/inventory");
const InventoryModel = require("../models/inventoryModel");
const InventoryView = require("../views/inventoryView");

const Recipe = require("../commands/recipe");
const RecipeModel = require("../models/recipeModel");
const RecipeView = require("../views/recipeView");

const { Sequelize } = require('sequelize');
const initializeModels = require('../models/model');

const program = new commander.Command();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/db.sqlite',
    logging: false
});

const models = initializeModels(sequelize);
const ingredientModel = new IngredientModel(models);
const ingredientView = new IngredientView();
const ingredient = new Ingredient(ingredientModel, ingredientView);


const inventoryModel = new InventoryModel(models);
const inventoryView = new InventoryView();
const inventory = new Inventory(inventoryModel, inventoryView, ingredientModel);

const recipeModel = new RecipeModel(models);
const recipeView = new RecipeView();
const recipe = new Recipe(recipeModel, recipeView, ingredientModel);


/* Ingredient-related commands */
const ingredientCommand = program.command('ingredient').description("Shows a list of all the ingredients".blue);

ingredientCommand
    .command("get")
    .description("Get all current ingredients".blue)
    .action((cmd) => ingredient.get());

ingredientCommand
    .command("add")
    .description("Add item to current ingredients. For example [--name='apple' --units='slices']".blue)
    .requiredOption("--name <string>", "Add specific ingredient")
    .requiredOption("--units <string>", "Add specific units")
    .action((cmd) => ingredient.add(cmd.name, cmd.units));

ingredientCommand
    .command("update")
    .description("Update item in ingredients. For example [--id='8' || --name='apple' --units='units']".blue)
    .requiredOption("--id <number>", "Update specific ingredient")
    .option("--name <string>", "Update specific quantity")
    .option("--units <string>", "Update specific quantity")
    .action((cmd) => ingredient.update(parseInt(cmd.id), cmd.name, cmd.units));

ingredientCommand
    .command("remove")
    .description("Remove item in ingredients. For example [--id='8']".blue)
    .requiredOption("--id <number>", "Remove specific ingredient")
    .action((cmd) => ingredient.remove(parseInt(cmd.id)));


/* Inventory-related commands */
const inventoryCommand = program.command('inventory').description("Shows a list of all the current inventory".blue);

inventoryCommand
    .command("get")
    .description("Get all current inventory".blue)
    .action((cmd) => inventory.get());

inventoryCommand
    .command("add")
    .description("Add item to current inventory. For example [--ingredient-id='8' || --amount='5.7']".blue)
    .requiredOption("--ingredient-id <number>", "ID of an ingredient")
    .requiredOption("--amount <decimal>", "Add specific quantity")
    .action((cmd) => inventory.add(parseInt(cmd.ingredientId), parseFloat(cmd.amount)));

inventoryCommand
    .command("update")
    .description("Update item in inventory. For example [--ingredient-id='8' || --amount='5.7']".blue)
    .requiredOption("--ingredient-id <number>", "Update specific ingredient")
    .requiredOption("--amount <decimal>", "Add specific quantity")
    .action((cmd) => inventory.update(parseInt(cmd.ingredientId), parseFloat(cmd.amount)));

inventoryCommand
    .command("remove")
    .description("Remove item in ingredients. For example [--ingredient-id='8']".blue)
    .requiredOption("--ingredient-id <number>", "Remove specific ingredient")
    .action((cmd) => inventory.remove(parseInt(cmd.ingredientId)));


/* Recipe-related commands */
const recipeCommand = program.command('recipe').description("Shows a list of recipes".blue);

recipeCommand
    .command("get")
    .description("Get all current recipes".blue)
    .action((cmd) => recipe.get());

recipeCommand
    .command("add")
    .description("Create a new recipe. For example [--name='Apple pie']".blue)
    .requiredOption("--name <string>", "Name of the recipe")
    .action((cmd) => recipe.add(cmd.name));

recipeCommand
    .command("update")
    .description("Update recipe name. For example [--id='8' --name='Warm Apple Pie']".blue)
    .requiredOption("--id <integer>", "recipe ID")
    .requiredOption("--name <string>", "Update recipe name")
    .action((cmd) => recipe.update(parseInt(cmd.id), cmd.name));

recipeCommand
    .command("remove")
    .description("Remove the recipe. For example [--id='8']".blue)
    .requiredOption("--id <integer>", "Recipe ID")
    .action((cmd) => recipe.remove(parseInt(cmd.id)));


recipeCommand
    .command("get-ingredient-list")
    .description("Get all ingredients needed to make the recipe. For examples [--id='8']".blue)
    .requiredOption("--id <number>", "Recipe ID")
    .action((cmd) => recipe.getIngredientList(parseInt(cmd.id)));

recipeCommand
    .command("add-ingredient")
    .description("Add ingredients to a recipe. For example [--id='8' --ingredient-id='10' --ingredient-amount='5']".blue)
    .requiredOption("--id <number>", "Recipe ID")
    .requiredOption("--ingredient-id <number>", "Ingredient ID")
    .requiredOption("--ingredient-amount <number>", "Amount of ingredient needed for this recipe")
    .action((cmd) => recipe.addIngredient(parseInt(cmd.id), parseInt(cmd.ingredientId), parseFloat(cmd.ingredientAmount)));

recipeCommand
    .command("update-ingredient")
    .description("Update ingredients of a recipe. For example [--id='8' --ingredient-id='15' --ingredient-amount='2'".blue)
    .requiredOption("--id <number>", "Recipe ID")
    .requiredOption("--ingredient-id <number>", "Ingredient ID")
    .requiredOption("--ingredient-amount <number>", "Amount of ingredient needed for this recipe")
    .action((cmd) => recipe.updateIngredient(parseInt(cmd.id), parseInt(cmd.ingredientId), parseFloat(cmd.ingredientAmount)));

recipeCommand
    .command("remove-ingredient")
    .description("Remove ingredient from the recipe. For example [--id='8' --ingredient-id='15']".blue)
    .requiredOption("--id <number>", "Recipe ID")
    .requiredOption("--ingredient-id <number>", "Ingredient ID")
    .action((cmd) => recipe.removeIngredient(parseInt(cmd.id), parseInt(cmd.ingredientId)));

recipeCommand
    .command("status")
    .description("Returns whether this recipe can be made with the current inventory. For exampe [--id='8']".blue)
    .option("--id <number>", "Recipe ID")
    .action((cmd) => recipe.status(parseInt(cmd.id)));



program.parse(process.argv);