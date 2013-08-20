/**
 * Page state service implementation allows you to keep track of the state of the page (what
 * tab has been selected / what page are we on) without having to monitor those changes
 * in your controller. It will gather up changes to these states and process them at the
 * end of the digest by firing of a $evalAsync.
 *
 * Example usage:
 *
 * - initialization
 *
 *      pageState.linkUp({'page': 0, 'activeTab' : 'programmes'}, function(newState) { /../ }));
 *
 *  when the linked up elements in the URL have changed because the user clicked the browser back-
 *  button, the function in the second argument is called. Which should be a pointer to a function
 *  in your scope.
 *
 * - state change
 *
 *      pageState.state('page', 10);
 *
 *   or:
 *
 *      pageState.state({ 'page': 10, 'activeTab' : 'all' });
 */
UOA.common.factory("pageState", ['utils', '$rootScope', '$location', function(utils, $rootScope, $location) {

    /**
     * Instantiate the page state service
     */
    return utils.instantiate({

        snapshots : [],

        /**
         * Default implementation of valid state function
         */
        validState : function() { return true; },

        /**
         * Take a snapshot of the current scope function
         */
        takeSnapshotFunction : function() {},

        /**
         * State map
         */
        stateMap : {},

        /**
         * Flag to indicate whether the route change was initiated inside this service
         */
        internalUpdate : false,

        /**
         * This is the flag that is set to true if eval async should run
         */
        awaitingEvalAsync : false,

        /**
         * Initialize the state map with a number of default values. The stated key names
         * will be synchronized from the URL parameter list provided by $location.search. If
         * these are not present, the default value is stored.
         *
         * @param keysWithDefaults a list of keys and their defaults. The defaults are used when the keys aren't present
         *        in the URL
         * @param takeSnapshot is the function to take a snapshot of the scope
         * @param notifyCallback this callback is called when the URL parameters have changed
         */
        linkUp : function(options) {

            var
                keysWithDefaults = options.defaults,
                validState = options.validState,
                takeSnapshot = options.takeSnapshot,
                notifyCallback = options.notifyCallback;

            var $this = this,
                searchParams = $location.search();

            // setup the state map with either default or current url values
            _.each(keysWithDefaults, function(defaultValue, keyName) {

                // try to synch state with URL, otherwise use default value
                if (_.isEmpty(searchParams[keyName])) {
                    $this.stateMap[keyName] = searchParams[keyName];
                }
                else {
                    $this.stateMap[keyName] = "" + defaultValue;
                }

            });

            // valid state function available?
            if (_.isDefined(validState)) {
                this.validState = validState;
            }

            if (_.isDefined(takeSnapshot)) {
                this.takeSnapshotFunction = takeSnapshot;
            }

            this._setupNotifierCallback(notifyCallback);
        },

        /**
         * Allows you to set the state of the values in the state map
         *
         * @param mapOrKey if this is a string, then it's the key and val is stored, otherwise the map is merged
         * @param val only used if the first parameter is a string
         */
        state : function(mapOrKey, val) {
            var $this = this,
                map = null;

            // is this actually a string (keyname) then turn it into a map
            if (_.isString(mapOrKey)) {
                map = {};
                map[mapOrKey] = val;
            }
            else {
                map = mapOrKey;
            }

            // set the values
            _.each(map, function(val, key) {
                $this.stateMap[key] = val;
            });


            if (this.validState()) {
                console.log("Is a valid state");
                this._takeSnapshotFor($this.stateMap);

                if (!this.awaitingEvalAsync) {
                    this._fireEvalAsync();
                }
            }
            else {
                console.log("invalid state");
            }

        },

        /**
         * Notifier callback setup, should only fire when a linked up variable has been changed in the URL
         *
         * @param notifier is the callback that should be fired when conditions are met
         * @private
         */
        _setupNotifierCallback : function(notifier) {
            var $this = this,
                hasChanged = false;

            // intercept route updates
            $rootScope.$on("$routeUpdate", function(event, eventValues) {

                // get new parameter values from event values
                var searchMap = eventValues.params;

                // don't bother if it's an internal update (reset flag)
                if ($this.internalUpdate) {
                    $this.internalUpdate = false;
                    return;
                }

                // determine whether anything changed
                _.each($this.stateMap, function(currentState, stateKey) {

                    // not the same? reassign.
                    if (currentState !== searchMap[stateKey]) {
                        $this.stateMap[stateKey] = searchMap[stateKey];
                        hasChanged = true;
                    }
                });

                // something changed? notify consumer.
                if (hasChanged) {
                    notifier(angular.copy($this.stateMap), $this._findSnapshotFor($this.stateMap));
                }
            });
        },

        /**
         * Store a snapshot of the scope state into the snapshots variable
         *
         * @param state is the state to store.
         * @private
         */
        _takeSnapshotFor : function(state) {

            var newSnapshot = this.takeSnapshotFunction();
            console.log(newSnapshot);

            if (newSnapshot) {

                // insert at beginning of array
                this.snapshots.splice(0, 0, {
                    state : this._serialize(state),
                    snapshot : angular.copy(newSnapshot)
                });

            }

            window.s = this.snapshots;
        },


        /**
         * Serialize a map of keys into a string. The keys are sorted to prevent the unsorted nature
         * of keys from duplicating snapshot states when they are actually the same.
         *
         * @param map is the map to serialize
         * @returns {string}
         * @private
         */
        _serialize : function(map) {

            var sortedKeys = _.keys(map).sort();
            var urlParts = _.map(sortedKeys, function(key) {
                var val = map[key];
                return key + "=" + val;
            });

            return urlParts.join("&");


        },

        /**
         * Find a snapshot state for the current stateMap values
         *
         * @param state is the state to compare
         * @private
         */
        _findSnapshotFor : function(state) {

            var serializedState = this._serialize(state),
                foundSnapshot = null;

            _.each(this.snapshots, function(snapshot) {

                if (snapshot.state === serializedState) {
                    foundSnapshot = snapshot.snapshot;
                }
            });

            return foundSnapshot;
        },

        /**
         * Generate a evalAsync callback to set the URL parameters into
         * the URL.
         */
        _fireEvalAsync : function() {
            var $this = this;

            // make sure to only add this callback once per state change batch
            if (!this.awaitingEvalAsync) {

                // reset flag
                this.awaitingEvalAsync = true;

                // fire off eval async that is run after all watches have been processed
                $rootScope.$evalAsync(function() {
                    $location.search(angular.copy($this.stateMap));
                    $this.internalUpdate = true;
                    $this.awaitingEvalAsync = false;
                });
            }
        }


    });

}]);