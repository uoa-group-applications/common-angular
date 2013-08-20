/**
 * Display tabs structure from certain angular service.
 */
UOA.common.directive("uoaTabs", ['utils', '$location', function(utils, $location) {

    return {

        /**
         * Attribute only directive
         */
        restrict : 'A',

        /**
         * Scope definition
         */
        scope : {

            /**
             * Tab provider service provided to show the tabs. Expected interface:
             *
             * tabProvider.getTabs() -> [ { url: .. , label: .. }, .. ]
             */
            tabProvider : "="

        },
        compile : function(element, attrs) {

            /**
             * Link function
             */
            return function(scope, tElement, tAttrs) {

                if (typeof(scope.tabProvider) !== "undefined") {

                    scope.tabs = angular.copy(scope.tabProvider.getTabs());

                    // decorate tab structure
                    _.each(scope.tabs, function (tab, key) {
                        tab.active = ($location.path() === tab.url);
                        tab.last = false;
                    });

                    _.last(scope.tabs).last = true;


                    // get directive template, compile with scope and place in element
                    utils.replaceWithTemplate(scope, tElement, UOA.template("tabs.html"));
                }
                else {
                    console.log("Unable to find tabProvider, not rendering tabs");
                }


            };
        }
    };
}]);

