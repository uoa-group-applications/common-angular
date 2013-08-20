/**
 * Pagination
 */
UOA.common.directive("uoaPagination", ['utils', function(utils) {

    return utils.templateDirective({

        /**
         * An attribute directive
         */
        restrict : 'A',

        /**
         * Template
         */
        template : UOA.template("pagination.html")
    });
}]);