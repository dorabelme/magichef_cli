const { isNumber, execute } = require('../utils/helper');
const errorView = require('../views/errorView');

// This file handles most of the business logic for ingredient
// It handles 1) input validation 2) talking to the model 3) rendering output or error to the user

class Ingredient {
    constructor(ingredientModel, ingredientView) {
        this.ingredientModel = ingredientModel;
        this.ingredientView = ingredientView;
    }

    get() {
        execute(async () => {
            const result = await this.ingredientModel.get();
            this.ingredientView.renderGetIngredients(result);
        })
    }

    add(name, units) {
        //Ensure input is reasonable
        if (name === '') {
            errorView.renderInputCannotBeEmpty('--name');
        } else if (units === '') {
            errorView.renderInputCannotBeEmpty('--units');
        } else {

            //Input seems valid
            execute(async () => {
                const output = await this.ingredientModel.add(name, units);
                this.ingredientView.renderAddIngredient(output);
            })
        }
    }

    async update(id, name, units) {
        //Ensure input is reasonable
        if (!isNumber(id)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--id');
        } else if (typeof name === 'undefined' && typeof units === 'undefined') {
            errorView.renderAtLeastOneInputIsRequired(['name', 'units']);
        } else if (!await this.ingredientModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Ingredient')
        } else {

            //Input seems valid
            execute(async () => {
                const {pre, post} = await this.ingredientModel.update(id, name, units);
                this.ingredientView.renderUpdateIngredient(pre, post);
            })
        }
    }

    async remove(id) {
        //Ensure input is reasonable
        if (!isNumber(id)) {
            errorView.renderInputNeedsToBeAPositiveInteger('--id');
        } else if (!await this.ingredientModel.exists(id)) {
            errorView.renderNoEntryExistsWithThisId(id, '--id', 'Ingredient')
        } else {

            //Input seems valid
            execute(async () => {
                const pre = await this.ingredientModel.remove(id);
                this.ingredientView.renderRemoveIngredient(pre);
            })
        }
    }
}

module.exports = Ingredient;