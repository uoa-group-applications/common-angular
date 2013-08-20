describe("Test API requests", function() {

	beforeEach(module('app'));
	beforeEach(module('restServices'));

	it("should be able to transform an array of multiple url parameters", inject(function(apiRequest) {
		
		var r;

		r = apiRequest._translateParameters({
			t : 'testString',
			s : 'secondString',
			i : 20
		});


		expect(r).toBe("?i=20&s=secondString&t=testString");

	}));	

	it("should ignore null parameters", inject(function(apiRequest) {
		var r;

		r = apiRequest._translateParameters({
			t : null
		});

		expect(r).toBe("?t=");
	}));


	it("should sort the keys before constructing the string to respect caching", inject(function(apiRequest) {
		
		var r;

		r = apiRequest._translateParameters({
			t : 'testString',
			s : 'secondString',
			i : 20
		});

	
		expect(r).toBe("?i=20&s=secondString&t=testString");
	}));

	it("should not add ampersand if there's only one url parameter", inject(function(apiRequest) {
		var r;

		r = apiRequest._translateParameters({
			t : 'testString'
		});

		expect(r).toBe("?t=testString");
		
	}));

	it("should not return anything when there is an empty map", inject(function(apiRequest) {
		expect(apiRequest._translateParameters({})).toBe('');
		expect(apiRequest._translateParameters(undefined)).toBe('');
		expect(apiRequest._translateParameters()).toBe('');
	}));


	it("should url encode parameters properly", inject(function(apiRequest) {
		
		r = apiRequest._translateParameters({
			t : 'testString with spaces',
			s : 'secondString',
			i : 20
		});

		expect(r).toBe("?i=20&s=secondString&t=testString%20with%20spaces");
	}));

});