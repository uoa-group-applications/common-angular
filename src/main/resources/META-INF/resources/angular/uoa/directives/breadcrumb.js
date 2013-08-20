/**
 * Breadcrumb directive
 */
UOA.common.directive("uoaBreadcrumb", ['utils', '$location', 'breadcrumbs',
    function(utils, $location, breadcrumbs) {

        /**
         * Breadcrumb definition
         */
        return {
            /**
             * Only apply as attribute
             */
            restrict : 'A',

            /**
             * Compile and replace with template
             */
            compile : function(element, attrs) {

                /**
                 * Linking function
                 */
                return function(scope, tElement, tAttrs) {

                    angular.extend(scope, {

                        /**
                         * Parent crumbs
                         */
                        breadcrumbs : []

                    });

                    scope.breadcrumbs = breadcrumbs.getBreadcrumbs();


                    // put template where in element
                    utils.replaceWithTemplate(scope, tElement, UOA.template("breadcrumb.html"));

                };
            }
        };
    }]);