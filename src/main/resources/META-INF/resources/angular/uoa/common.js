/*
 * initialize PCF app namespace
 */
window.UOA = window.UOA || {};

window.JS_SETTINGS = window.JS_SETTINGS || {};

/**
 * This structure provides access to all the ajax url endpoints required for the application. All the values should be
 * populated in /grails-app/views/application/_resources.gsp
 */
UOA.endpoints = UOA.endpoints ? UOA.endpoints : { baseUrl: null };

UOA.dateConfiguration = {
    date : {
        dateFormat : "dd/mm/yy",
        showOn : 'both',
        buttonText : '&nbsp;'
    }
};

/**
 * UOA module specific template locations
 */
UOA.template = function(templateName) {
    return window.template(UOA.endpoints.base, templateName, "uoa");
};

/*
 *  Create PCF app common module
 */
UOA.common = angular.module("uoa-common", []);

UOA.services = angular.module("uoa-services", []);
UOA.mockServices = angular.module("uoa-mockServices", []);
UOA.restServices = angular.module("uoa-restServices", []);
UOA.httpServices = angular.module("uoa-syllabus-http", []);

UOA.library = angular.module("uoa", ["uoa-common", "uoa-services", "uoa-mockServices", "uoa-restServices"]);

