/* This view logs the output to the console */
/* By abstracting this away, we could change impl to write to a file, send response via HTTP, etc. */

const colors = require("colors");

class IngredientView {
    constructor() {        
    }

    renderGetIngredients(allIngredients) {
        console.log('\nGetting a list of all the ingredients...'.green);
        console.table(allIngredients);
    }

    renderAddIngredient(output) {
        console.log('\nAdding new ingredient'.green);
        console.table([output]);
    }

    renderUpdateIngredient(pre, post) {
        console.log("\nBefore...".green);
        console.table([pre]);

        console.log('\nAfter...'.green);
        console.table([post]);
    }

    renderRemoveIngredient(pre) {
        console.log('\nRemoved ingredient');
        console.table([pre]);
    }
}

module.exports = IngredientView;