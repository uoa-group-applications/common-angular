/**
 * Directive test
 */
describe("Search results directive test", function() {

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
			'va-search-results', 
			{	// attrs
				'query-provider' : 'queryProvider',
				'query' : 'query',
				'selected-result' : 'result'
			}, 
			{	// scope

				query : {},
				result : {},
				queryProvider : {

					/**
					 * Get some fake results
					 */
					list : function(query, page, perPage, callback) {
						var results = {
		                    items : [
		                        v(), v(), v(), v(), v()
		                    ],
		                    nItems : 14,
		                    perPage : perPage,
		                    currentPage : page
		                };

		                callback(results);
					}	
				}
			}
		);
	}));


	// ------------------------------------------------------------
	//		Assertions
	// ------------------------------------------------------------


	it("should start on the first page", function() {
		expect(dir.scope.hasPreviousPage).toBe(false);
		expect(dir.scope.hasNextPage).toBe(true);		
	});


	it("should calculate the correct number of pages", function() {
		// 14 results, so has 3 pages
		expect(dir.scope.pages.length).toBe(3);
	});


	it("should have correct page information", function() {

		dir.scope.gotoPage(1);
		expect(dir.scope.hasPreviousPage).toBe(false);
		expect(dir.scope.hasNextPage).toBe(true);
		expect(dir.scope.pages[0].active).toBe(true);

		dir.scope.gotoPage(3);
		expect(dir.scope.hasPreviousPage).toBe(true);
		expect(dir.scope.hasNextPage).toBe(false);
		expect(dir.scope.pages[2].active).toBe(true);

		dir.scope.gotoPage(2);
		expect(dir.scope.hasPreviousPage).toBe(true);
		expect(dir.scope.hasNextPage).toBe(true);
		expect(dir.scope.pages[1].active).toBe(true);

	});


	// ------------------------------------------------------------
	//	Helper functions (not important, so at the bottom)
	// ------------------------------------------------------------

	var date = Math.floor(new Date().getTime() * 0.8);
    function v() {
        date = new Date(Math.floor(date * 1.004));
        var vacancy = {

            id : 1,
            title : "Youth aid support",
            organization : "Red beach Surf Life Saving Club",

            addedOn : date,
            startDate : date,
            endDate : date,
            status : "Awaiting moderation",

            teaserDescription : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",

            type : {
                id: "1",
                name : "Part-time"
            },

            region : {
                id : "1",
                name : "Auckland"
            },

            area : {
                id : "2",
                name : "Rodney"
            },

            facebookPage : "http://www.facebook.com/rbslsc",

            useAgencyDetails : "no",

            agencyContact : {
                name : "Information from agency record",
                email : "j.chapman@rbslsc.co.nz",
                phone : "09 423 4567"
            },

            contact : {
                name : "John Chapman",
                email : "j.chapman@rbslsc.co.nz",
                phone : "09 423 4567"
            },

            logo : "/volunteer/images/tmp/vacancy-logo.png"


        };

        return vacancy;
    }
});