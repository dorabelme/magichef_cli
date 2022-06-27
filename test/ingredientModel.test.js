const { Sequelize } = require('sequelize');
const initializeModels = require('../models/model');
const IngredientModel = require("../models/ingredientModel");


const getIngredientModel = () => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });

    const models = initializeModels(sequelize, params = { 'force': true });
    const ingredientModel = new IngredientModel(models);
    return ingredientModel
}

describe('Ingredient model', () => {

    describe('get', () => {
        const ingredientModel = getIngredientModel();

        it('should return a empty array from the ingredient route', async () => {
            const ingredients = await ingredientModel.get();
            expect(ingredients).toEqual([]);
        });
    });

    describe('getIngredientById', () => {
        const ingredientModel = getIngredientModel();

        it('should return an ingredient at provided id', async () => {
            await ingredientModel.add("apple", "units");

            let ingredient = await ingredientModel._getById(1);

            expect(ingredient.id).toBe(1);
            expect(ingredient.name).toBe("apple")
        });
    });

    describe('add Ingredient', () => {
        const ingredientModel = getIngredientModel();

        it('should add an ingredient to db', async () => {
            await ingredientModel.add("apple", "units");
            const ingredients = await ingredientModel.get();

            expect(ingredients).toHaveLength(1);

            let ingredient = await ingredientModel.add("banana", "units");
            expect(ingredient.name).toBe("banana")

            ingredient = await ingredientModel.add("avocado", "grams");
            expect(ingredient.name).toBe("avocado")
        });
    });

    describe('update Ingredient', () => {
        const ingredientModel = getIngredientModel();

        it('should update an ingredient at provided id', async () => {
            await ingredientModel.add("avocado", "grams");

            let id = 1;
            const { pre, post } = await ingredientModel.update(id, "avocado", "units");

            expect(post.units).toBe("units");
        });
    });

    describe('remove Ingredient', () => {
        const ingredientModel = getIngredientModel();

        it('should remove an ingredient at provided id', async () => {
            await ingredientModel.add("potato", "units");

            let id = 1;
            await ingredientModel.remove(id);

            const ingredients = await ingredientModel.get();
            expect(ingredients).toEqual([]);
        });
    });
});