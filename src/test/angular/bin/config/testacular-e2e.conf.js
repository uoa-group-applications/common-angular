basePath = '../../../../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'web-app/js/libs/angular.js',
  'web-app/js/libs/angular-*.js',
  'web-app/js/libs/jquery-1.8.3.js',
  'web-app/js/libs/underscore*.js',
  'test/angular/lib/angular/angular-mocks.js',
  'test/angular/lib/angular/quicksetup.js',
  'web-app/js/angular/common.js',
  'web-app/js/angular/services/utils.js',
  'web-app/js/angular/controllers/**/*.js',
  'web-app/js/angular/directives/**/*.js',
  'web-app/js/angular/filters/**/*.js',
  'web-app/js/angular/mockServices/**/*.js',
  'web-app/js/angular/restServices/**/*.js',
  'web-app/js/angular/services/**/*.js',
  'test/angular/e2e/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

singleRun = false;

proxies = {
  '/volunteer/': 'http://localhost:8090/volunteer/'
};

urlRoot = '/__testacular/';

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
 