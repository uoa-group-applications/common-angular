/**
 * This service provides an abstraction layer between components that need to translate 'markdown' enhanced text
 * content into html.
 */
UOA.common.factory('markdownService', [ 'utils', 'apiRequest', function(utils, apiRequest) {

    return utils.instantiate({

        endpoint: UOA.endpoints.uoa.markdown,

        /**
         * Take the provided markdown and transform it into html. The required callback must match the signature:
         * <code>callback(boolean success, ? response)</code>
         * @param text The provided markdown
         * @param callback The function to callback when the parsing is complete.
         */
        render: function(text, callback) {
            var onSuccess = function(response) { callback(true, response); };
            var onFailure = function(response) { callback(false, response); };
            apiRequest.post(this.endpoint, { payload: text }, onSuccess, onFailure);
        }

    });
} ]);