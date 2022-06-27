const { extractFields, extractFieldsFromArray } = require('../utils/helper');
const commonFields = ['id', 'name', 'units'];

// IngredientModel abstracts away most of the crud operations so users don't need to worry about the implementation details

class IngredientModel {
    constructor(models) {
        this.models = models;
    }

    async _getById(id) {
        const { Ingredient } = await this.models;
        const existingIngredient = await Ingredient.findByPk(id);
        return existingIngredient;
    }

    async exists(id) {
        const e = await this._getById(id);
        return e !== null;
    }

    async get() {
        const { Ingredient } = await this.models;
        const allIngredients = await Ingredient.findAll();
        return extractFieldsFromArray(allIngredients, commonFields);
    }

    async add(name, units) {
        const { Ingredient } = await this.models;

        const newIngredient = await Ingredient.create({ name, units });
        return extractFields(newIngredient, commonFields);
    }

    async update(id, name, units) {
        const existingIngredient = await this._getById(id);
        const pre = extractFields(existingIngredient, commonFields);

        existingIngredient.name = name || existingIngredient.name;
        existingIngredient.units = units || existingIngredient.units;

        const _post = await existingIngredient.save();
        const post = extractFields(_post, commonFields);

        return { pre, post };
    }

    async remove(id) {
        const { Ingredient } = await this.models;
        const existingIngredient = await this._getById(id);
        const pre = extractFields(existingIngredient, commonFields);

        await Ingredient.destroy({ where: { id } });
        return pre;
    }
}

module.exports = IngredientModel;