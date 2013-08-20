/**
 * The directive code for a panel editor that allows previewing of markdown-esque content without breaking the webpage.
 * <p>Author: <a href="http://gplus.to/tzrlk">Peter Cummuskey</a></p>
 */
UOA.common.directive('uoaWikiPanel', [ 'utils', 'markdownService', function(utils, markdownService) {

    return utils.templateDirective({
        restrict: 'A', // Attribute only

        template: UOA.template('wikiPanel.html'),

        scope: {

            /** the content to work on */
            markdownContent: '=',

            /** a class string to add to the preview panel div. */
            previewClass: '@',

            /** URL where to find help on the markdown syntax */
            helpUrl: '@',

            /** set to true when the contents is preview only **/
            previewOnly : '@',

            /** a validator we want to apply to the elements **/
            validator : '&',

            /** a validator error message **/
            validatorError: '@'

        },

        controller: [ '$scope', '$element', function($scope, $element) {
            angular.extend($scope, {

                /** The status of the control, whether it be 'editing', 'rendering', 'flailing', or 'previewing'. */
                displayStatus: 'editing',

                /** Whether the rendered content needs to be re-rendered. */
                dirtyContent: true,

                /** Where the rendered content gets stored. */
                renderedContent: "",

                /** What message gets displayed if an error during rendering occurs. */
                errorMessage: _t("uoa.wiki-panel.error"),

                /** Convenience booleans for determining which UI components are enabled/visible at what time */
                enabled: {
                    doEdit: false,
                    doPreview: true
                },

                /**
                 * Switches the component into rendering mode, and kicks off a rendering request. If the content hasn't
                 * been modified since it was last rendered, the component is instead switched to previewing mode and
                 * no other work is done.
                 */
                doPreview: function() {

                    if (!$scope.dirtyContent) {
                        // markdown already rendered, just switch to preview.
                        $scope.displayStatus = 'previewing';
                        return;
                    }

                    // avoid multiple renderings of the same content.
                    $scope.dirtyContent = false;
                    $scope.displayStatus = 'rendering';

                    // trigger the rendering process
                    markdownService.render($scope.markdownContent, $scope.handleResponse);
                },

                /** Switches the component into editing mode */
                doEdit: function() {
                    $scope.displayStatus = 'editing';
                },

                /** Handles the response from markdown rendering and unlocks the wiki panel. */
                handleResponse: function(success, response) {
                    if (!success) {
                        $scope.errorMessage = $scope._t(response.code);
                        $scope.displayStatus = 'flailing';
                        $scope.dirtyContent = true;
                        return;
                    }

                    // updated the rendered content.
                    $scope.renderedContent = response.payload;
                    $scope.displayStatus = 'previewing';
                },

                /**
                 * This function just takes the height of the editing textarea, and sets all the other content elements
                 * to have that same height. It makes the transition between elements seamless.
                 */
                syncHeight: function() {
                    // make sure the target panel has the same size as the editor.
                    var $content = $element.find('.uoa-wiki-panel-content');
                    var editorHeight = $content.filter('textarea').css('height');
                    $content.css('height', editorHeight);
                },


                /**
                 * Inspired by http://jsfiddle.net/nsHGZ/
                 *
                 * @param area is the element to put a character into
                 * @private
                 */
                _insertTabAtCaret : function() {
                    var area = $element.find("textarea");
                    var text = '\t';
                    var txtarea = area.get(0);
                    var areaContents = area.val();

                    var scrollPos = area.scrollTop();
                    var strPos = 0;
                    var br =
                        (
                            (txtarea.selectionStart || txtarea.selectionStart == '0') ?
                                "ff"
                            :
                                (document.selection ? "ie" : false )
                        );

                    // internet explorer?
                    if (br === "ie") {
                        txtarea.focus();
                        var range = document.selection.createRange();
                        range.moveStart('character', -areaContents.length);
                        strPos = range.text.length;
                    }
                    // firefox?
                    else if (br === "ff") {
                        strPos = txtarea.selectionStart;
                    }

                    var front = areaContents.substring(0, strPos);
                    var back = areaContents.substring(strPos, areaContents.length);
                    area.val(front + text + back);
                    strPos = strPos + text.length;

                    if (br === "ie") {
                        txtarea.focus();
                        var range = document.selection.createRange();
                        range.moveStart('character', -areaContents.length);
                        range.moveStart('character', strPos);
                        range.moveEnd('character', 0);
                        range.select();
                    }
                    else if (br === "ff") {
                        txtarea.selectionStart = strPos;
                        txtarea.selectionEnd = strPos;
                        txtarea.focus();
                    }

                    txtarea.scrollTop = scrollPos;
                }

            });

            // detect tab pressed
            $element.keydown(function(evt) {
                var keyCode = evt.keyCode || evt.which;

                // 9 = tab
                if (keyCode === 9) {
                    $scope._insertTabAtCaret();
                    evt.preventDefault();
                }
            });

            $scope.$watch("validatorError", function(msg) {
                if (msg) {
                    $scope.errorMessage = msg;
                }
            });

            // get the validator function from the passed in code reference
            // or set default if not provided.
            if (!_.isDefined($scope.validator())) {
                $scope.validatorFunc = function(val) { return true; };
            }
            else {
                $scope.validatorFunc = $scope.validator();
            }


            if ($scope.previewOnly) {
                $scope.displayStatus = "rendering";
                $scope.$watch("markdownContent", function(val) {
                    if (_.isDefined(val)) {
                        $scope.doPreview();
                    }
                });
            }

            // Add a watch to re-dirty the content flag on changing the markdown.
            $scope.$watch('markdownContent', function() {
                $scope.dirtyContent = true;
            });

            $scope.$watch('displayStatus', function() {

                // If not editing, make sure that all the other panels are the right height.
                if ($scope.displayStatus !== 'editing' && !$scope.previewOnly) {
                    $scope.syncHeight();
                }

                // update the display enabled fields
                angular.extend($scope.enabled, {

                    /** The edit button should only be enabled when either previewing or display an error */
                    doEdit: /^(flailing|previewing)$/.test($scope.displayStatus),

                    /** The preview button should only be visible when editing */
                    doPreview: /^(editing)$/.test($scope.displayStatus)

                });

            });

        } ]
    });




}]);