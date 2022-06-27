const { flattenNestedIngredient } = require('../utils/helper');
const commonFields = ['id', 'name', 'units'];

// InventoryModel abstracts away most of the crud operations so users don't need to worry about the implementation details

class InventoryModel {
    constructor(models) {
        this.models = models;
    }

    async _getById(ingredientId) {
        const { Inventory, Ingredient } = await this.models;
        const existingInventory = await Inventory.findOne({ include: Ingredient, where: { 'IngredientId': ingredientId } });
        return existingInventory;
    }

    async exists(ingredientId) {
        const e = await this._getById(ingredientId);
        return e !== null;
    }

    async get() {
        const { Inventory, Ingredient } = await this.models;
        const inventoryItems = await Inventory.findAll({ include: Ingredient });
        return inventoryItems.map(item => flattenNestedIngredient(item));
    }

    async add(ingredientId, amount) {
        const { Inventory } = await this.models;
        await Inventory.create({ 'IngredientId': ingredientId, amount });
        const inventoryWithIngredient = await this._getById(ingredientId);

        const output = flattenNestedIngredient(inventoryWithIngredient);
        return output;
    }

    async update(ingredientId, amount) {
        const existingInventoryItem = await this._getById(ingredientId);
        const pre = flattenNestedIngredient(existingInventoryItem);

        existingInventoryItem.amount = amount || existingInventoryItem.amount;
        const post = flattenNestedIngredient(await existingInventoryItem.save());

        return { pre, post }
    }

    async remove(ingredientId) {
        const { Inventory } = await this.models;
        const existingIngredient = await this._getById(ingredientId);
        const pre = flattenNestedIngredient(existingIngredient, commonFields);

        await Inventory.destroy({ where: { 'IngredientId': ingredientId } });
        return pre
    }
}

module.exports = InventoryModel;