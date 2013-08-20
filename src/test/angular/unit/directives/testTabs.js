/**
 * https://github.com/vojtajina/ng-directive-testing/blob/start/test/tabsSpec.js
 */
describe("Test the tab component", function() {

	var dir;

	// ------------------------------------------------------------
	//		Initialize
	// ------------------------------------------------------------

	beforeEach(module('app'));
	beforeEach(module('mockServices'));

	beforeEach(inject(function($compile, $rootScope) {
		dir = directive(
			$compile, 
			$rootScope, 
			'va-tabs', 
			{	// attrs
				'tab-provider' : 'tabService'
			}, 
			{	// scope
				tabService : {
					getTabs : function() {
						var tabs = [
				               { url: '/', label: 'Vacancy administration'},
				               { url: '/details', label: 'Agency Details'}
				           ];

						return tabs;				
					}
				}
			}
		);
	}));


	// ------------------------------------------------------------
	//		Assertions
	// ------------------------------------------------------------
 
	it("should put tabs from a service on the scope", function() {
		expect(dir.scope.tabs).toBeDefined();		
	});

	it("should annotate the last tab is being last", function() {
		expect(_.last(dir.scope.tabs).last).toBe(true);
	});


});