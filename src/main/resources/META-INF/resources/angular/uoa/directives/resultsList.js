(function(undefined) {

    /**
     * Constants necessary for calculations in
     * @type {*|number}
     */
    var
        N_PER_PAGE = JS_SETTINGS.resultsPerPage || 8,
        FILTER_THRESHOLD = JS_SETTINGS.paginationThreshold || 8,
        FILTER_MAX = JS_SETTINGS.paginationMaximum || 7;

    /**
     * Search results directive. Used in conjunction with the uoaPagination directive which
     * is nothing more than a scope-less template.
     *
     * queryProvider is service instance with the following method signature:
     *
     *    .list ( queryObject, pageNumber, nItemsPerPage, function(results) { .. callback .. } )
     *
     * the results are formatted as follows:
     *
     *   { currentPage: 0, nItems : 100, items : [ {}, {} , .. ] }
     *
     * template-name attribute is used to point at path for to be rendered result item
     *
     */
    UOA.common.directive("uoaResultsList", ['utils', function(utils) {

        return {
            restrict : 'A',

            scope : {

                /**
                 * The query provider that is used to request new information from
                 */
                queryProvider : '=',

                /**
                 * The query object that is passed to the query provider
                 */
                query : '=',

                /**
                 * Results can be shared with controller (optional)
                 */
                results : '=',

                /**
                 * A reference to an object that contains the currently selected result
                 */
                selectedResult : '=',

                /**
                 * When this is set "high", the query provider will reload (optional)
                 */
                reloadSignal : '=',

                /**
                 * Template name
                 */
                templateName : '@',

                /**
                 * Event hook for when page is changed
                 */
                onPageChange : "&",

                /**
                 * Set this attribute to any value to selected the first element automatically.
                 */
                autoSelect : '@',

                /**
                 * If explicitly set to false don't load first page
                 */
                autoLoad : "@",

                /**
                 * The page to start off from. It's a function so just pass a reference
                 * to a function in your controller here: start-page="getStartPage"
                 */
                startPage : "&"
            },

            /**
             * Initialize the results list instance
             *
             * @param scope is the scope
             * @param element is the element this directive is invoked on
             * @param attributes are the attributes passed to this directive invocation
             */
            link : function(scope, element, attributes) {

                // default page
                var startPageNr = 1;

                // is a startPage function bound?
                if (_.isDefined(scope.startPage)) {

                    var initialNumber,
                        startPageFunction = scope.startPage();

                    // is a proper function reference?
                    if (startPageFunction) {
                        initialNumber = startPageFunction();
                    }

                    // returns something useful? set.
                    if (_.isDefined(initialNumber)) {
                        startPageNr = initialNumber + 1;
                    }
                }

                // wait until a template name is set
                scope.$watch("templateName", function() {

                    var tplName = scope.templateName;

                    if (!tplName) {
                        console.error("Need to specify the template-name attribute otherwise no result list can be generated");
                        return;
                    }

                    // put in angular html template
                    utils.replaceWithTemplate(scope, element, tplName);
                });


                // needs to watch for reloading signal?
                if (_.isDefined(scope.reloadSignal)) {
                    scope.$watch('reloadSignal', function() {
                        if (scope.reloadSignal) {
                            scope.gotoPage(startPageNr, true);
                        }
                        scope.reloadSignal = false;
                    });
                }

                // @attributes are not yet bound to the scope when link() is called
                // if not explicitly set to false go ahead and load the first page
                if (attributes.autoLoad !== "false") {
                    scope.gotoPage(startPageNr, true);
                }
            },

            /**
             * Controller implementation for the searchresults pagination
             */
            controller : ['$scope', function($scope) {

                _.extend($scope, {

                    /**
                     * Currently selected result
                     */
                    selected : null,

                    /**
                     *  Results
                     */
                    results : null,

                    /**
                     * Page structure
                     */
                    pages : null,

                    /**
                     * Page structure filtered properly
                     */
                    filteredPages : null,

                    /**
                     * Next page number
                     */
                    nextPage : false,

                    /**
                     * Can go to next page?
                     */
                    hasNextPage : false,

                    /**
                     * Previous page number
                     */
                    previousPage : false,

                    /**
                     * Can go to previous page
                     */
                    hasPreviousPage : false,

                    /**
                     * Move to the next page
                     *
                     * @param number is the page number to switch to
                     * @param preselectFirstResult is set to true if the first result needs to be preselected
                     */
                    gotoPage : function(number, preselectFirstResult) {

                        var $this = this;

                        // setup scope with new results
                        $scope.queryProvider.list($this.query, number - 1, N_PER_PAGE, function(results) {
                            $scope.results = results;
                            $scope.pages = $scope._setupPages($this.results);
                            $scope.filteredPages = $scope._filterPages($scope.pages, FILTER_THRESHOLD, FILTER_MAX);
                            $scope.nextPage = number + 1;
                            $scope.previousPage = number - 1;

                            // should next/prev buttons be visible?
                            $scope.hasNextPage = ($scope.nextPage <= $scope.pages.length);
                            $scope.hasPreviousPage = ($scope.previousPage > 0);

                            var highlight = $scope._getHighlightedResult(preselectFirstResult);
                            if (highlight) {
                                $scope.selectResult(highlight);
                            }

                        });
                    },


                    /**
                     * Determine the highlighted result on this page. Returns
                     * undefined when nothing is found. When the shared model
                     * `selectedResult` has been found on this page, it will be
                     * highlighted. If the preselectFirstResult flag is set, regardless
                     * of anything else, that one will be used.
                     *
                     * @param preselectFirstResult  is generally true on page load
                     * @return {Object} with the selected result.
                     * @private
                     */
                    _getHighlightedResult : function(preselectFirstResult) {
                        // pre-selecting
                        if (preselectFirstResult && $scope.autoSelect) {
                            return _.first($scope.results.items);
                        }

                        // check if there's something that's already been selected on this page
                        else if ($scope.selectedResult && !_.isUndefined($scope.selectedResult.id)) {

                            var sResult;
                            _.each($scope.results.items, function(item) {
                                if (!_.isUndefined(item.id) && item.id === $scope.selectedResult.id) {
                                    sResult = item;
                                }
                            });

                            return sResult;
                        }
                    },


                    /**
                     * Select a result (selectedResult is out parameter)
                     *
                     * @param result is the selected row
                     */
                    selectResult : function(result) {

                        // (re)set active flag
                        _.each($scope.results.items, function(item) {
                            item.active = false;
                        });
                        result.active = true;

                        // set in scope
                        if (!_.isUndefined($scope.selectedResult)) {
                            $scope.selectedResult = result;
                        }
                    },


                    /**
                     * Make sure not too many pages are being shown
                     *
                     * @param pageStruct are the full structure
                     * @param threshold is the number of pages after which cropping will start
                     * @param max are the maximum number of pages that should be displayed
                     */
                    _filterPages : function(pageStruct, threshold, max) {

                        // only allow odd number of page results
                        if (max % 2 === 1) {

                            // pages more than allowed?
                            if (pageStruct.length > threshold) {

                                var
                                    // generic info
                                    len = pageStruct.length,
                                    width = (max - 1) / 2,
                                    activePage = this._getActivePageNumber(pageStruct),

                                    // determine overflow of left and right from activePage <-> width
                                    // and its boundaries (0, len)
                                    leftOverflow = Math.abs(Math.min(0, activePage - width)),
                                    rightOverflow = Math.abs(Math.max(len, activePage + width + 1) - len),

                                    // position begin and end indices
                                    startIdx = Math.max(0, activePage - (width + rightOverflow)),
                                    endIdx = Math.min(len, activePage + width + leftOverflow);

                                // slice the page results into what we want.
                                return pageStruct.slice(startIdx, endIdx + 1 /* is not inclusive */);
                            }
                            else {
                                return pageStruct;
                            }
                        }
                        else {
                            return [];
                        }
                    },


                    /**
                     * @private
                     * @return active page index of page struct
                     */
                    _getActivePageNumber : function(pageStruct) {
                        var activePageIdx = null;
                        _.each(pageStruct, function(page, index) {
                            if (page.active) {
                                activePageIdx = index;
                            }
                        });
                        return activePageIdx;
                    },


                    /**
                     * Create a page information array
                     *
                     * @param results is the results structure (that contain nItems information)
                     * @private
                     */
                    _setupPages : function(results) {
                        var pageStruct = [];
                        var nPages = Math.ceil(results.nItems / N_PER_PAGE);

                        for (var pIdx = 0; pIdx < nPages; ++pIdx) {
                            pageStruct.push({
                                active : pIdx === results.currentPage,
                                number : (pIdx + 1)
                            });
                        }

                        return pageStruct;
                    }

                });
            }]
        };
    }]);

})();