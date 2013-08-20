/**
 * This utility requires the underscore string library
 */
UOA.common.factory("textUtils", ['utils', function(utils) {

    /**
     * A number of string related functions
     */
    return utils.instantiate({

        /**
         * Convenience function that makes a nice teaser text out of a description
         * that is too long.
         *
         * @param phrase        The phrase to shorten
         * @param nChars        Maximum number of chars.
         * @param addition      The ellipse characters to use (default: &hellip;)
         * @return {String}     The shortened stirng returned with proper ellipses.
         */
        shorten : function(phrase, nChars, addition) {
            return this.addEllipses(this.wrapToWord(phrase, nChars), addition, nChars);
        },

        /**
         * Wrap to the next word boundary found after the maximum number of characters.
         *
         * @param phrase TODO: document this
         * @param nChars TODO: document this
         */
        wrapToWord : function(phrase, nChars) {
            phrase = _.str.trim(phrase || '');

            // not necessary to cut.
            if (phrase.length <= nChars) {
                return phrase;
            }

            // find next boundary
            else {
                var spaceIdx = phrase.indexOf(" ", nChars);
                return phrase.substring(0, spaceIdx);
            }
        },

        /**
         * Add ellipses in the way you'd want to be added, proper spacing
         * after interpunction. If it was the end of a sentence, don't add them.
         *
         * @param phrase is the phrase to add them to
         * @param addition TODO: document this
         * @param nChars TODO: document this
         * @return {String} a string with ellipses added.
         */
        addEllipses : function(phrase, addition, nChars) {
            nChars = nChars || 0;
            addition = addition || "&hellip;";
            phrase = _.str.trim(phrase);

            if (phrase.length >= nChars) {
                if (_.contains(['.', '!', '?'], _.last(phrase))) {
                    return phrase;
                }

                if (_.contains([',', ';', ':'], _.last(phrase))) {
                    return phrase + " " + addition;
                }

                return phrase + addition;
            }
            else {
                return phrase;
            }

        }

    });

}]);