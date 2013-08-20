/**
 * Show a checkmark when the value is true, otherwise return nothing
 */
UOA.common.filter("empty", function() {
    return function(input, alternative) {
        if (input) {
            return input;
        }
        return alternative;
    };
});