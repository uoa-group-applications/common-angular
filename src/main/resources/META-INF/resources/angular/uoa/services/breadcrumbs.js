UOA.common.factory("breadcrumbs", ['$location', 'utils', function($location, utils) {

    // make sure the fixedBase is considered permanent
    if (typeof(UOA.Breadcrumbs.fixedBase) !== "undefined") {
        angular.forEach(UOA.Breadcrumbs.fixedBase, function(val, key) {
            UOA.Breadcrumbs.fixedBase[key].permanent = true;
        });
    }


    /**
     * A function that constructs the breadcrumb
     */
    return utils.instantiate({


        getBreadcrumbs : function(crumbs, crumbsTable) {

            // setup crumbs table or use default application-wide one.
            crumbsTable = crumbsTable || UOA.Breadcrumbs.table;

            crumbs =
                _.flatten(
                    [
                        (crumbs || UOA.Breadcrumbs.fixedBase),
                        this.getApplicationCrumbs(crumbsTable)
                    ]
                );

            // set correct view properties
            this.annotateList(crumbs);

            return crumbs;

        },


        /**
         * Has an explicitly defined root crumb? (a key with '')
         *
         * @param crumbsTable
         * @return {*}
         */
        hasExplicitRoot : function(crumbsTable) {
            return angular.isObject(crumbsTable['']);
        },

        /**
         * Are we currently looking at the root page? return true.
         *
         * @param locationElements all path elements
         * @return {Boolean}
         */
        viewingRootPage : function() {
            return this._locationPath() === "/";
        },

        /**
         * Get the crumb elements for the current application path's page
         *
         * @param crumbsTable is the crumb table to look at for information
         */
        getApplicationCrumbs : function(crumbsTable) {

            var
                appCrumbs = [],
                locationElements = _.str.words(this._locationPath(), "/"),
                error = false,
                parentLocation = this._getParentLocation(),
                crumbsParent = crumbsTable;

            // using hashbang?
            if (this._usingHashbang()) {
                parentLocation += "#/";
            }

            // if a root element was defined, and we're not currently looking at it,
            // insert it in the tree.
            if (this.hasExplicitRoot(crumbsTable) && !this.viewingRootPage()) {
                locationElements = _.flatten(['', locationElements]);
            }

            // go through url elements
            angular.forEach(locationElements, function(uriPart) {

                // update crumb element's location
                parentLocation = parentLocation + (uriPart !== '' ? (uriPart + "/") : '');

                // has this name?
                if (typeof(crumbsParent[uriPart]) !== "undefined") {

                    // get title
                    var parentTitle =
                        angular.isString(crumbsParent[uriPart]) ?
                            crumbsParent[uriPart]
                        :
                            crumbsParent[uriPart]._;

                    // add to list
                    appCrumbs.push({
                       title : parentTitle,
                       url : parentLocation
                    });

                    crumbsParent = crumbsParent[uriPart];
                }
                else {
                    error = true;
                }
            });

            // successful?
            if (!error) {
                return appCrumbs;
            }
            else {
                console.log("Error creating breadcrumb for " + this._locationPath());
                return [];
            }
        },

        /**
         * Annotate the list with the proper style related attributes
         *
         * @param crumbs  are the crumbs to annotate
         */
        annotateList : function(crumbs) {
            angular.forEach(crumbs, function(crumb, key) {
                crumb.last = (key === crumbs.length - 1);
            });
        },

        /**
         * Getter for location path
         */
        _locationPath : function() {
            return $location.path();
        },

        /**
         * Are we using the html5 mode or not?
         */
        _usingHashbang : function() {
            return window.location.href.indexOf("#/") !== -1;
        },

        /**
         * This method retrieves the start of the breadcrumb
         */
        _getParentLocation : function() {
            return document.location.pathname;
        }

    });

}]);