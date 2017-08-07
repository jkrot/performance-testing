var app = angular.module('fileSelector', []);

// Config
app.config(appConfig);
appConfig.$inject = ['$compileProvider'];

function appConfig ($compileProvider) {
    'use strict';
    // Turns Debugging Info Off
    $compileProvider.debugInfoEnabled(false);  // make false for performance/production
}

app.directive('fileModel', fileModel);
fileModel.$inject = ['$parse', '$log', '$q'];

function fileModel ($parse, $log, $q) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            // Configs

            if (typeof scope.configs !== "object"){
                configs = scope.configs;
            }else{

                configs.customerConfigs = {};
                configs.customerConfigs.uploader = {};
                configs.customerConfigs.uploader.jpeg = false;  // Allow Jpegs
                configs.customerConfigs.uploader.mpeg = false;  // Allow Mpegs

            }

            element.bind('change', function(data){
                scope.$apply(function folderParse(){
                    modelSetter(scope, element[0].files);
                    scope.folder = scope.parseFolder(scope.myFolder, configs);
                });
            });

        }
    };
}

// Javascript Polyfills

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
