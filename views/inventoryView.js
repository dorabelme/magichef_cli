/* This view logs the output to the console */
/* By abstracting this away, we could change impl to write to a file, send response via HTTP, etc. */

const colors = require("colors");

class InventoryView {
    renderGetInventory(inventory) {
        console.log('\nGetting a list of all ingredients in the inventory...'.yellow);
        console.table(inventory);
    }
    renderAddIngredientToInventory(newItem) {
        console.log('\nAdding new ingredient to the inventory'.yellow);
        console.table(newItem);
    }
    renderUpdateInventoryItem(pre, post) {
        console.log("\nBefore...".yellow);
        console.table(pre);

        console.log('\nAfter...'.yellow);
        console.table(post);
    }
    renderRemoveItemFromInventory(pre) {
        console.log('\nRemoved ingredient from inventory'.yellow);
        console.table([pre]);
    }
}

module.exports = InventoryView;