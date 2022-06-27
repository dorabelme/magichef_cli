const errorView = require('../views/errorView');

const {  isNumber, execute, isAPositiveNumber } = require('../utils/helper');

class Recipe {
    constructor(recipeModel, recipeView, ingredientModel) {
        this.recipeModel = recipeModel;
        this.recipeView = recipeView;
        this.ingredientModel = ingredientModel;
    }

    async get() {
        execute(async () => {
            const result = await  this.recipeModel.get();
            this.recipeView.renderGetRecipe(result);
        })
    }
    async add(name) {
        //Ensure input is reasonable
        if (name === '') {
            errorView.renderInputCannotBeEmpty('--name');
        } else {

            //Input seems valid
            execute(async () => {
                const output = await  this.recipeModel.add(name);
                this.recipeView.renderAddRecipe(output);
            })
        }
    }
    async update(id, name) {
        //Ensure input is reasonable
        if (name === '') {
            errorView.renderInputCannotBeEmpty('--name');
        } else if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else {

            //Input seems valid
            execute(async () => {
                const {pre, post} = await  this.recipeModel.update(id, name);
                this.recipeView.renderUpdateRecipe(pre, post);
            })
        }
    }
    async remove(id) {
        //Ensure input is reasonable
        if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else {

            //Input seems valid
            execute(async () => {
                const pre = await  this.recipeModel.remove(id);
                this.recipeView.renderRemoveRecipe(pre);
            })
        }
    }
    async getIngredientList(id) { 
        //Ensure input is reasonable
        if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else {

            //Input seems valid
            execute(async () => {
                const output = await  this.recipeModel.getIngredientsForId(id);
                this.recipeView.renderIngredientForRecipe(output);
            })
        }
    }
    async addIngredient(id, ingredientId, ingredientAmount) {
        //Ensure input is reasonable
        if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else if (!await this.ingredientModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Ingredient')
        } else if (!isAPositiveNumber(ingredientAmount)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--ingredient-amount');
        }  else if (await this.recipeModel.usesIngredient(id, ingredientId)) {
            errorView.renderRecipeAlreadyUsesIngredient(id, ingredientId);
        } else {
            
            //Input seems valid
            execute(async () => {
                const {existingIngredient, post} = await  this.recipeModel.addIngredient(id, ingredientId, ingredientAmount);
                this.recipeView.renderAddIngredient(existingIngredient, post, ingredientAmount);
            })
        }
    }
    async updateIngredient(id, ingredientId, ingredientAmount) {
        //Ensure input is reasonable
        if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else if (!await this.ingredientModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Ingredient')
        } else if (!isAPositiveNumber(ingredientAmount)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--ingredient-amount');
        } else if (!await  this.recipeModel.usesIngredient(id, ingredientId)) {
            errorView.renderRecipeDoesNotUseIngredient(id, ingredientId);
        } else {
            const {existingIngredient, post} = await  this.recipeModel.updateIngredient(id, ingredientId, ingredientAmount);
            this.recipeView.renderUpdateIngredient(existingIngredient, post, ingredientAmount);
        }
    }
    async removeIngredient(id, ingredientId) {
        //Ensure input is reasonable
        if (!await  this.recipeModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Recipe')
        } else if (!await this.ingredientModel.exists(ingredientId)) {
            errorView.renderNoEntryExistsWithThisId(ingredientId, '--ingredient-id', 'Ingredient')
        } else if (!await this.recipeModel.usesIngredient(id, ingredientId)) {
            errorView.renderRecipeDoesNotUseIngredient(id, ingredientId);
        } else {
            const {existingIngredient, post} = await  this.recipeModel.removeIngredient(id, ingredientId);
            this.recipeView.renderRemoveIngredient(existingIngredient, post);
        }
    }
    async status(recipeId) { 

        if (isNumber(recipeId)) {
            //Ensure input is reasonable
            if (!await  this.recipeModel.exists(recipeId)) {
                errorView.renderNoEntryExistsWithThisId(recipeId, '--id', 'Recipe')
            } else if (!await  this.recipeModel.isComplete(recipeId)) {
                errorView.renderRecipeIsNotComplete(recipeId)            
            } else {
                const {name, missingIngredients, makeablePortions} = await  this.recipeModel.statusForId(recipeId);
                this.recipeView.renderStatusForId(name, missingIngredients, makeablePortions);
            }
        } else {
            // Logic repeated per recipe
            const output = await  this.recipeModel.statusForAll();
            this.recipeView.renderStatusForAll(output);
        }
    }
}

module.exports = Recipe;