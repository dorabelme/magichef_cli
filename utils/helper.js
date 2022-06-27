const fs = require('fs');
const errorView = require('../views/errorView');
const colors = require("colors");


/**
 * Extracts a subst of fields for every object inside arr
 * @param {array} arr
 * @param {array} fields 
 * @returns {array} 
 */
const extractFieldsFromArray = (arr, fields) => {
  return arr.map(item => extractFields(item, fields));
}

/**
 * Extracts a subst of fields for object
 * @param {object} obj
 * @param {array} fields 
 * @returns {array} result
 */
const extractFields = (obj, fields) => {
  const updatedArray = fields.map(fieldName => [fieldName, obj.toJSON()[fieldName]]);
  const result = Object.fromEntries(updatedArray);
  return result;
}

/**
 * Returns an error object with proper properties
 * @param {object} err
 * @returns {object}
 */
const constructErrorObject = (err) => {
  let errors = [];

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    errors = [{ 'type': "Used a key that doesn't exist", 'message': "Use a valid key" }];
  } else {
    errors = err.errors.map(i => {
      const r = { "type": i.type, "message": i.message };
      return r;
    });
  }

  return { 'type': 'error', 'errors': errors };
}

/**
 * Extracts an ingredient from a nested ingredient object
 * @param {object} nestedIngredient
 * @returns {object}
 */
const flattenNestedIngredient = (nestedIngredient) => {
  return {
    'ingredientId': nestedIngredient.Ingredient.id,
    'amount': nestedIngredient.amount,
    'name': nestedIngredient.Ingredient.name,
    'units': nestedIngredient.Ingredient.units
  };
}

/**
 * Wrapper that contains error handling with try - catch block
 * @param {func} f
 */
const execute = async (f) => {
  try {
    await f();
  } catch (err) {
    if (err?.errors)
      errorView.renderErrors(err.errors);
    else
      errorView.renderError(err);
  }
}


/**
 * Extracts a recipe from a nested recipe object
 * @param {object} nestedRecipe
 * @returns {object}
 */
const flattenRecipe = (nestedRecipe) => {
  const ingredients = nestedRecipe?.Ingredients.map(item => {
    const obj = { 'ingredientId': item.RecipeIngredient.IngredientId, 'name': item.name, 'units': item.units, 'amount': item.RecipeIngredient.amount };
    return obj;
  })

  return {
    'id': nestedRecipe.id,
    'name': nestedRecipe.name,
    'ingredients': ingredients
  };
}


const isNumber = (value) => !isNaN(value)
const isPositive = (value) => value > 0
const isAPositiveNumber = (value) => isNumber(value) && isPositive(value)


exports.extractFields = extractFields;
exports.extractFieldsFromArray = extractFieldsFromArray;
exports.constructErrorObject = constructErrorObject;
exports.flattenNestedIngredient = flattenNestedIngredient;
exports.execute = execute;
exports.flattenRecipe = flattenRecipe;
exports.isNumber = isNumber;
exports.isPositive = isPositive;
exports.isAPositiveNumber = isAPositiveNumber;