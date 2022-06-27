const colors = require("colors");


const processDBErrorMessages = (errors) => {
    const processed = errors.map(processDBError);
    return processed;
}

const processDBError = (error) => {
    return { 'message': error.message, 'type': error.type || error.name }
}

const errorView = {
    renderAnEntryAlreadyExistsWithThisId(id, fieldName, entryType) {
        console.error(`\nAn entry ${entryType} already exists for this ${fieldName}=${id}\n`.red);
    },
    renderNoEntryExistsWithThisId(id, fieldName, entryType) {
        console.error(`\nNo ${entryType} exists for this ${fieldName}=${id}\n`.red);
    },
    renderAtLeastOneInputIsRequired(_fields) {
        const fields = _fields.map(f => `--${f}`);
        console.error(`\nAt least one of the following inputs need to be present (${fields.join(', ')})\n`.red);
    },
    renderInputNeedsToBeAPositiveInteger(fieldName) {
        console.error(`\n${fieldName} needs to be a positive integer\n`.red);
    },
    renderInputCannotBeEmpty(fieldName) {
        console.error(`\n${fieldName} cannot be empty\n`.red);
    },
    renderErrors(errors) {
        const processedErrors = processDBErrorMessages(errors);
        console.log('\nEncountered the following errors:'.red);
        console.table(processedErrors);
    },
    renderError(error) {
        this.renderErrors([error].red);
    },
    renderRecipeDoesNotUseIngredient(id, ingredientId) {
        console.log(`\nThis recipe --id=${id} doesn't use this --ingredient-id=${ingredientId}; try again!\n`.red);
    },
    renderRecipeAlreadyUsesIngredient(id, ingredientId) {
        console.log(`\nThis recipe --id=${id} already uses this --ingredient-id=${ingredientId}; update the ingredient instead!\n`.red);
    },
    renderRecipeIsNotComplete(id) {
        console.log(`\nThis recipe --id=${id} doesn't have any ingredients in its instructions. Add some ingredients or use a different recipe.\n`.red);
    }
}

module.exports = errorView;