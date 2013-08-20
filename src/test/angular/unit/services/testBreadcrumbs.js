describe("Breadcrumbs service testing", function() {

	beforeEach(module('app'));

	/**
	 * Setting some sane basics
	 */
	var 
		HOST = 'http://localhost/volunteer/',
		monkeypatch = function(path) { 
			return {
				_locationPath : function() { return path || '/'; },
				_usingHashbang : function() { return true; },
				_getParentLocation : function() { return HOST; }
			}
		},
		table = {
			'' : {
				_ : "Root page",
				home : "Home",
				detail : {
					_ : "Detail",
					edit : "Edit"
				}
			}
		};

	it("should correctly annotate the last element as being `last`", inject(function(breadcrumbs) {
		
		var a = [{}, {}, {}];
		breadcrumbs.annotateList(a);

		expect(a[0].last).toBe(false);
		expect(a[1].last).toBe(false);
		expect(a[2].last).toBe(true);

	}));

	it("should recognize when the table has an inner root element", inject(function(breadcrumbs) {
		
		var withExplicitRoot = {
			'' : {}
		};

		var withoutExplicitRoot = {
			'something' : "title"
		};

		expect(breadcrumbs.hasExplicitRoot(withExplicitRoot)).toBe(true);
		expect(breadcrumbs.hasExplicitRoot(withoutExplicitRoot)).toBe(false);
		
	}));


	it("should know when we're looking at the root", inject(function(breadcrumbs) {
		breadcrumbs._locationPath = function() { return '/'; };
		expect(breadcrumbs.viewingRootPage()).toBe(true);

		breadcrumbs._locationPath = function() { return '/subpage'; };
		expect(breadcrumbs.viewingRootPage()).toBe(false);
	}));


	it("should return the root crumb if we're at '/'", inject(function(breadcrumbs) {

		_.extend(breadcrumbs, monkeypatch('/'));		// make safe

		var crumbs = breadcrumbs.getApplicationCrumbs(table);
		expect(crumbs.length).toBe(1);
		expect(crumbs[0].url).toBe(HOST + "#/");
		expect(crumbs[0].title).toBe('Root page');
	}));


	it("should read the title from string if there are no subpages", inject(function(breadcrumbs) {
		_.extend(breadcrumbs, monkeypatch("/home"));	// make safe

		var crumbs = breadcrumbs.getApplicationCrumbs(table);
		expect(crumbs.length).toBe(2);

		expect(crumbs[0].url).toBe(HOST + "#/");
		expect(crumbs[0].title).toBe('Root page');

		expect(crumbs[1].url).toBe(HOST + "#/home/");
		expect(crumbs[1].title).toBe('Home');
	}));
	

	it("should read the title from '_' if there are subpages", inject(function(breadcrumbs) {
		_.extend(breadcrumbs, monkeypatch("/detail")); 	// make safe

		var crumbs = breadcrumbs.getApplicationCrumbs(table);
		expect(crumbs.length).toBe(2);

		expect(crumbs[0].url).toBe(HOST + "#/");
		expect(crumbs[0].title).toBe('Root page');

		expect(crumbs[1].url).toBe(HOST + "#/detail/");
		expect(crumbs[1].title).toBe('Detail');
	}));	


	it("should properly merge the fixed base with the breadcrumb", inject(function(breadcrumbs) {
		_.extend(breadcrumbs, monkeypatch("/detail/edit"));		

		var a = [{}, {}];
		var completeCrumb = breadcrumbs.getBreadcrumbs(a, table);

		expect(completeCrumb.length).toBe(5);
		expect(angular.equals({last: false}, completeCrumb[0])).toBe(true);
		expect(angular.equals({last: false}, completeCrumb[1])).toBe(true);

	}));
});