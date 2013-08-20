/**
 * Test the newline to br filter
 */
describe("Newline to <br/> filter", function() {

	beforeEach(module('app'));

	it("should convert newline to break", inject(function($filter) {
		var nl2br = $filter('nl2br');
		expect(nl2br("test\nthis")).toBe("test<br/>this");
	}));

});