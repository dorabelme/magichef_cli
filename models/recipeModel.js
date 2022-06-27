const { flattenRecipe } = require('../utils/helper');
const IngredientModel = require('../models/ingredientModel');
const InventoryModel = require('../models/inventoryModel');

// RecipeModel abstracts away most of the crud operations so users don't need to worry about the implementation details

class RecipeModel {
    constructor(models) {
        this.models = models;
        this.ingredientModel = new IngredientModel(models);
        this.inventoryModel = new InventoryModel(models);
    }

    async _getById(recipeId) {
        const { Recipe, Ingredient } = await this.models;
        const existingRecipe = await Recipe.findOne({ where: { id: recipeId }, include: Ingredient })
        return existingRecipe;
    }

    async exists(recipeId) {
        const e = await this._getById(recipeId);
        return e != null
    }

    async isComplete(recipeId) {
        const existing = flattenRecipe(await this._getById(recipeId));
        const { name, ingredients } = existing;

        return ingredients && ingredients.length > 0
    }

    async usesIngredient(recipeId, ingredientId) {
        const existingRecipe = await this._getById(recipeId);
        const existingIngredient = await this.ingredientModel._getById(ingredientId);

        return existingRecipe.hasIngredient(existingIngredient);
    }

    async get() {
        const { Recipe, Ingredient } = await this.models;
        const all = await Recipe.findAll({ include: Ingredient });
        const output = all.map(i => flattenRecipe(i))
        return output
    }

    async getIngredientsForId(recipeId) {
        const recipe = await this._getById(recipeId);
        const output = flattenRecipe(recipe);
        return output
    }

    async add(name) {
        const { Recipe } = await this.models;
        const recipe = await Recipe.create({ name: name });
        return recipe
    }

    async update(id, name) {
        const existingRecipe = await this._getById(id);
        const pre = flattenRecipe(existingRecipe);

        existingRecipe.name = name || existingRecipe.name;
        const post = flattenRecipe(await existingRecipe.save());

        return { pre, post }
    }

    async remove(id) {
        const { Recipe, Ingredient } = await this.models;
        const existing = await this._getById(id);

        const pre = flattenRecipe(existing);
        await Recipe.destroy({ where: { 'id': id } });

        return pre
    }

    async addIngredient(id, ingredientId, ingredientAmount) {
        const existingRecipe = await this._getById(id);
        const existingIngredient = await this.ingredientModel._getById(ingredientId);

        await existingRecipe.addIngredient(existingIngredient, { through: { amount: ingredientAmount } })

        const post = flattenRecipe(await this._getById(id));

        return { existingIngredient, post }
    }

    async updateIngredient(id, ingredientId, ingredientAmount) {
        const { Recipe, Ingredient } = await this.models;

        const existingRecipe = await this._getById(id);
        const existingIngredient = await this.ingredientModel._getById(ingredientId);

        await existingRecipe.removeIngredient(existingIngredient);
        await existingRecipe.addIngredient(existingIngredient, { through: { amount: ingredientAmount } })

        const post = flattenRecipe(await this._getById(id));

        return { existingIngredient, post }
    }

    async removeIngredient(id, ingredientId) {
        const { Recipe, Ingredient } = await this.models;

        const existingRecipe = await this._getById(id);
        const existingIngredient = await this.ingredientModel._getById(ingredientId);

        await existingRecipe.removeIngredient(existingIngredient);

        const post = flattenRecipe(await this._getById(id));

        return { existingIngredient, post }
    }

    async _status(existing, ingredientsInInventory) {
        // Logic for a single recipe; do it in-memory for now and will need to run it in SQL to optimize

        const { name, ingredients } = existing;

        const output = ingredients.map(i => {
            const item = ingredientsInInventory.find(j => j.ingredientId === i.ingredientId);
            return (item === undefined) ? { ...i, portion: 0, delta: i.amount } : { ...i, portion: Math.trunc(item.amount / i.amount), delta: i.amount - item.amount }
        })

        const missingIngredients = output.filter(o => o.portion === 0);
        const makeablePortions = Math.min(...output.filter(o => o.portion != 0).map(o => o.portion));

        return { name, missingIngredients, makeablePortions }
    }

    async statusForId(id) {
        const existing = flattenRecipe(await this._getById(id));
        const ingredientsInInventory = await this.inventoryModel.get();

        const { name, missingIngredients, makeablePortions } = await this._status(existing, ingredientsInInventory);

        return { name, missingIngredients, makeablePortions }
    }

    async statusForAll() {
        const existingRecipes = (await this.get()).filter(r => r.ingredients.length > 0);
        const ingredientsInInventory = await this.inventoryModel.get();

        const output = await Promise.all(existingRecipes.map(e => this._status(e, ingredientsInInventory)));
        return output
    }
}

module.exports = RecipeModel;