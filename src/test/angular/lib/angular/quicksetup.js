/**
 * Some global functions to help with quickly injecting and loading directives.
 */

function directive($compile, $rootScope, name, attributes, scope) {
	/**
	 * Create a list of key='val' value form
	 */
	function parseAttributes() {
		return _.map(attributes, function(val, key) { return key + '="' + val + '" '; });
	}


	// create html
	var html = 
		_.flatten(
				["<div ", name, " ", parseAttributes(), "></div>"]
			).join("");

	var objScope = $rootScope.$new();

	angular.extend(objScope, scope);

	// compile and find directive's objScope.
	$compile(angular.element(html))(objScope);
	objScope.$digest();

	var result = {
		scope : objScope.$$childTail,
		parentScope : objScope
	};

	return result
}