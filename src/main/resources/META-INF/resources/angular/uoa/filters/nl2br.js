/**
 * Convert new lines to <br/>
 */
UOA.common.filter("nl2br", function() {
    return function(input) {
        if (input) {
            return input.replace(/\n/g, "<br/>");
        }
        return input;
    };
});