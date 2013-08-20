UOA.common.directive("uoaModeration", ['utils', function(utils) {

    return {

        /**
         * Attribute only
         */
        restrict : 'A',

        /**
         * Scope definition
         */
        scope : {
            moderationType : "@",
            onApprove : "&",
            onDecline : "&",
            model : "="
        },

        /**
         * Setup the template
         *
         * @param scope
         * @param element
         * @param attrs
         */
        link : function(scope, element, attrs) {

            utils.replaceWithTemplate(scope, element, UOA.template("moderation.html"));
        },

        controller : ['$scope', '$attrs', function($scope, $attrs) {

            _.extend($scope, {

                /**
                 * Moderation form
                 */
                moderationForm : null,


                /**
                 * Model for the form.
                 */
                formModel : {

                    /**
                     * Text container for the reason of decline
                     */
                    reason : {
                        modification : null,
                        decline : null
                    },

                    /**
                     * What kind of moderation to do?
                     */
                    action : 'approve',

                    /**
                     * Make sure the form is incomplete
                     */
                    incomplete : true

                },


                /**
                 * Has 'approve and modify' option?, default: yes
                 */
                canModify : ($attrs.canModify === 'false' ? false : true),

                /**
                 * Submit the moderation result to the handlers.
                 */
                submit : function() {
                    if ($scope.formModel.action === 'approve') {
                        $scope.onApprove()();
                    }
                    else if ($scope.formModel.action === "modifications" && this.canModify) {
                        $scope.onApprove()($scope.formModel.reason.modification);
                    }
                    else if ($scope.formModel.action === "decline") {
                        $scope.onDecline()($scope.formModel.reason.decline);
                    }

                },


                /**
                 * Reset the form
                 */
                reset : function() {
                    this.formModel = {
                        action : 'approve',
                        reason : {
                            modification : '',
                            decline : ''
                        }
                    };
                }


            });

            // if the model changes, make sure to reset this component.
            $scope.$watch('model', function() {
                $scope.reset();
            });


            $scope.$watch(function() {
                if ($scope.moderationForm) {
                    $scope.formModel.incomplete = !$scope.moderationForm.$valid;
                }
            });

        }]
    };
}]);