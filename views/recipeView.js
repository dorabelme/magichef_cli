/* This view logs the output to the console */
/* By abstracting this away, we could change impl to write to a file, send response via HTTP, etc. */

const colors = require("colors");

class RecipeView {
    renderSingleRecipe(r) {
        const isInComplete = r.ingredients.length === 0 ? 'is incomplete' : '';
        console.log(`\nRecipe for '${r.name}' ${isInComplete} (id: ${r.id})`.cyan);
        console.table(r.ingredients);
        console.log('');
    }
    renderGetRecipe(result) {
        if (result) {
            console.log('\nGetting a list of all recipes'.cyan);
            result.forEach(this.renderSingleRecipe);
        } else {
            console.log('\nNo recipes. Add some to get started.\n'.cyan);
        }
    }
    renderAddRecipe(newItem) {
        console.log(`\nCreating new recipe with id=${newItem.id} name=${newItem.name}\n`.cyan);
    }
    renderUpdateRecipe(pre, post) {
        console.log("\nBefore...".cyan);
        console.table(pre);

        console.log('\nAfter...'.cyan);
        console.table(post);
    }
    renderRemoveRecipe(pre) {
        console.log('\nRemoved recipe'.cyan);
        console.table(pre);
    }

    renderIngredientForRecipe(recipe) {
        this.renderSingleRecipe(recipe)
    }

    renderAddIngredient(existingIngredient, post, ingredientAmount) {
        console.log(`\nAdded requirement of '${ingredientAmount}' '${existingIngredient.units}' of '${existingIngredient.name}' to '${post.name}' recipe`.cyan);
        this.renderSingleRecipe(post);
    }
    renderUpdateIngredient(existingIngredient, post, ingredientAmount) {
        console.log(`\nUpdated requirement of '${ingredientAmount}' '${existingIngredient.units}' of '${existingIngredient.name}' to '${post.name}' recipe`.cyan);
        this.renderSingleRecipe(post);
    }
    renderRemoveIngredient(existingIngredient, post) {
        console.log(`\nRemoved requirementof '${existingIngredient.name}' to '${post.name}' recipe`.cyan);
        this.renderSingleRecipe(post);
    }
    renderStatusForId(name, missingIngredients, makeablePortions) {
        if (missingIngredients.length === 0) { // recipe can be made
            console.log(`\nWe can make ${makeablePortions} portions for ${name}. Yum Yum!`.cyan);
        } else {
            console.log(`\nUnable to make ${name} recipe. We are missing the following ingredients + amounts from inventory:`.red);
            missingIngredients.forEach((i, idx) => console.log(`${idx + 1}) ${i.delta} ${i.units} of ${i.name} --ingredient-id=${i.ingredientId}`.red));
        }
    }
    renderStatusForAll(outputArray) {
        console.log("\nLooking across all recipes and ingredients in inventory we have...".cyan);

        const makeableRecipies = outputArray;
        makeableRecipies.forEach(m => {
            this.renderStatusForId(m.name, m.missingIngredients, m.makeablePortions);
        });
    }
}

module.exports = RecipeView;