/**
 * Validation state of the user's input.
 * {@docCategory Pickers}
 */
export var ValidationState;
(function (ValidationState) {
    /** User input is valid. */
    ValidationState[ValidationState["valid"] = 0] = "valid";
    /** User input could be valid or invalid, its state is not known yet. */
    ValidationState[ValidationState["warning"] = 1] = "warning";
    /** User input is invalid. */
    ValidationState[ValidationState["invalid"] = 2] = "invalid";
})(ValidationState || (ValidationState = {}));
//# sourceMappingURL=BasePicker.types.js.map