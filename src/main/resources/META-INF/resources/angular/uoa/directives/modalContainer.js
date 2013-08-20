/**
 * Modal container allows a piece of HTML to be separated into a popup dialog (no iframes involved.)
 *
 * - See modalFormTemplate for things that need to be styled
 * - Smoke layer is darkened background
 * - Modal box will contain this directives element HTML
 *
 * usage:
 *
 * <div uoa-modal-container callback='showModalContainer' name="modal-layer">
 *
 *     .. your modal content here..
 *
 *
 * </div>
 *
 *
 * Call the done() function to trigger the modal's close
 *
 * Adds a function to the invoking's control's scope with the name specified in the callback attribute. Calling
 * that function will invoke the modal container.
 */
UOA.common.directive('uoaModalContainer', ['$compile', 'utils', '$timeout', function($compile, utils, $timeout) {

    var
        modalFormTemplate =
            [
                '<div class="modal-content" ng-cloak ng-show="visible">',
                    '<div class="smoke-layer"><!----></div>',
                    '<div class="modal-box"><!----></div>',
                '</div>'
            ].join("");


    /**
     * Centered position for element
     */
    function topPosition(height) {
        var top = $(window).scrollTop() + ($(window).height() / 2 - (height / 2));
        return top;
    }


    return {
        restrict : 'A',

        /**
         * Compile function
         */
        compile : function(tElement, tAttrs) {


            var originalContent = tElement.html();
            tElement.toggleClass("hide", true);
            tElement.html(modalFormTemplate);

            /**
             * Instance dependent actions
             */
            return function(scope, element, attrs) {

                scope.visible = false;

                // compile content
                var
                    modalBox = $(element).find(".modal-box"),
                    smokeLayer = $(element).find(".smoke-layer"),
                    modalContent = $(element).find(".modal-content");

                element.attr("id", "mb-" + attrs.name);
                modalBox.html(originalContent);
                $compile(modalBox.contents())(scope);

                smokeLayer.click(function() {
                    scope.visible = false;
                    scope.$apply();
                });

                element.toggleClass("hide", false);

                /**
                 * Call this when the user is done with the modal
                 */
                scope.done = function() {
                    $(window).unbind(".modalbox");
                    scope.visible = false;
                };



                /**
                 * Add show function to jquery element.
                 */
                scope[attrs.callback] = function() {

                    modalContent.css({
                        visibility: "hidden",
                        display: "block"
                    });

                    var height = modalBox.height();
                    modalContent.css("top", "100px");

                    modalContent.css({
                        display: "block",
                        visibility : "visible"
                    });



                    scope.visible = true;
                };

            };


        }
    };
}]);


