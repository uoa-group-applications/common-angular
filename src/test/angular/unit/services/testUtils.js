describe("Test the utils service", function() {


	beforeEach(module('common'));
	
	describe("Safe int", function() {
	
			
		it("should only respond when it has parameters", inject(function(utils) {
			expect(utils.safeInt()).toBeUndefined();
		}));

		it("should return undefined when something other than a number is provided", inject(function(utils) {
			expect(utils.safeInt("NaN")).toBeUndefined();
		}));

		it("should not make floats into integers", inject(function(utils) {
			expect(utils.safeInt("10.10")).toBe("10");
		}));

	});


});