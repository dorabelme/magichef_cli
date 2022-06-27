const { Sequelize, DataTypes } = require('sequelize');

// Common attribute types
const uniqueNonNullString = {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true // To avoid confusion
}

const nonNullString = {
  type: DataTypes.STRING,
  allowNull: false
}

const amountType = {
  type: DataTypes.FLOAT,
  allowNull: false,
  validate: {
    isDecimal: true,
    min: 0
  }
}

const initializeModels = async (sequelize = new Sequelize('sqlite::memory:'), params = {}) => {
  /* Ingredient Table */
  const Ingredient = sequelize.define('Ingredient', {
    name: uniqueNonNullString,
    units: nonNullString
  });

  /* Inventory Table */
  const Inventory = sequelize.define('Inventory', {
    amount: amountType
  });

  /* Recipe Table */
  const Recipe = sequelize.define('Recipe', {
    name: uniqueNonNullString
  });

  const RecipeIngredient = sequelize.define('RecipeIngredient', {
    RecipeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Recipe,
        key: 'id'
      }
    },
    IngredientId: {
      type: DataTypes.INTEGER,
      references: {
        model: Ingredient,
        key: 'id'
      }
    },
    amount: amountType
  });


  Ingredient.hasOne(Inventory, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    foreignKey: {
      allowNull: false,
      unique: true
    }
  });
  Inventory.belongsTo(Ingredient);

  Ingredient.belongsToMany(Recipe, { through: 'RecipeIngredient' });
  Recipe.belongsToMany(Ingredient, { through: 'RecipeIngredient' });

  if (params)
    await sequelize.sync(params)
  else
    await sequelize.sync()

  const models = {
    'Ingredient': Ingredient,
    'Inventory': Inventory,
    'Recipe': Recipe,
    'RecipeIngredient': RecipeIngredient
  }

  return models;
}

module.exports = initializeModels;