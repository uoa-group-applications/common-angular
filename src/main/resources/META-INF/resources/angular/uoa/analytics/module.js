/**
 * The analytics module is able to provide some simple out of the box
 * analytics functionality for our angular applications. It will listen to
 * route changes and provide a reasonable virtual page view, which:
 *
 * - will allow us to get a better view on which pages are visited
 * - will allow us to get more reliable stats for: time on site; and bounce rates
 */


/**
 * Create a service
 */
UOA.analytics.factory('analytics', ['utils', '$location', function(utils, $location) {

    return utils.instantiate({

        /**
         * @returns {string} the virtual url for the current location
         */
        virtualUrl : function() {
            var base = document.location.pathname;
            var appBase = $location.url();

            if (!appBase) {
                appBase = "/";
            }

            // last character is a slash?
            if (base.lastIndexOf("/") === base.length - 1) {
                base = base.substring(0, base.length - 1);
            }
            return base + appBase;
        },

        /**
         * This method is a proxy for the normal google analytics array
         * but is injectable (and therefor testable).
         */
        push : function(/* can be any number of parameters */) {
            _gaq.push(arguments);
        }

    });
}]);


/**
 * This is run when the module is loaded, it will bind to the root scope and listen
 * for any changes in the route.
 */
UOA.analytics.run(['$rootScope', 'analytics', function($rootScope, analytics) {

    var lastUrl = null;

    $rootScope.$on('$locationChangeSuccess', function(event, next) {

        var url = analytics.virtualUrl();
        if (next !== "" && url != lastUrl) {
            analytics.push("trackPageview", url);
            lastUrl = url;
        }
    })

}]);

