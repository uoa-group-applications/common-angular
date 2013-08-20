basePath = '../../../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'web-app/js/libs/angular.js',
  'web-app/js/libs/angular-*.js',
  'web-app/js/libs/jquery-1.8.3.js',
  'web-app/js/libs/underscore*.js',
  'test/angular/lib/angular/angular-mocks.js',
  'test/angular/lib/angular/quicksetup.js',
  'web-app/js/angular/common.js',
  'web-app/js/angular/services/utils.js',
  'web-app/js/angular/**/*.js',
  'test/angular/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
