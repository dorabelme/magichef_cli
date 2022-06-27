const IngredientModel = require('../models/ingredientModel');
const { isAPositiveNumber, execute } = require('../utils/helper');
const errorView = require('../views/errorView');

class Inventory {
    constructor(inventoryModel, inventoryView, ingredientModel) {
        this.inventoryModel = inventoryModel;
        this.inventoryView = inventoryView;
        this.ingredientModel = ingredientModel;
    }

    async get() {
        execute(async () => {
            const result = await this.inventoryModel.get();
            this.inventoryView.renderGetInventory(result);
        })
    }
    async add(ingredientId, amount) {
        //Ensure input is reasonable
        if (!isAPositiveNumber(ingredientId)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--ingredient-id');
        } else if (!isAPositiveNumber(amount)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--amount');
        } else if (await this.inventoryModel.exists(ingredientId)) {
            errorView.renderAnEntryAlreadyExistsWithThisId(ingredientId, '--ingredient-id', 'Ingredient')
        } else if (!await this.ingredientModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Ingredient')
        } else {

            //Input seems valid
            execute(async () => {
                const output = await this.inventoryModel.add(ingredientId, amount);
                this.inventoryView.renderAddIngredientToInventory(output);
            })
        }
    }
    async update(ingredientId, amount) {
        //Ensure input is reasonable
        if (!isAPositiveNumber(ingredientId)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--ingredient-id');
        } else if (!isAPositiveNumber(amount)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--amount');
        } else if (!await this.inventoryModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Inventory')
        } else {

            //Input seems valid
            execute(async () => {
                const {pre, post} = await this.inventoryModel.update(ingredientId, amount);
                this.inventoryView.renderUpdateInventoryItem(pre, post);
            })
        }
    }
    async remove(ingredientId) {
        //Ensure input is reasonable
        if (!isAPositiveNumber(ingredientId)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--ingredient-id');
        } else if (!await this.inventoryModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Inventory')
        } else {

            //Input seems valid
            execute(async () => {
                const existing = await this.inventoryModel.remove(ingredientId);
                this.inventoryView.renderRemoveItemFromInventory(existing);
            })
        }
    }
}

module.exports = Inventory;