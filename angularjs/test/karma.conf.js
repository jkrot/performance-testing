module.exports = function (config) {
	config.set({
		logLevel : 'info',
		basePath : '',
		autoWatch : true,
		files: [    '../node_modules/angular/angular.js', 
                    '../node_modules/dicom-parser/dist/dicomParser.js',     
                    '../app/js/main.js', 
                    '../app/js/fileCtrl.js',
					'../node_modules/angular-mocks/angular-mocks.js',
					'spec/*.js'
				],
		frameworks: ['jasmine'],
		browsers : ['Chrome'],
		plugins : [
			'karma-spec-reporter',
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-coverage',
			'karma-htmlfile-reporter'
		],
		reporters : ['spec', 'coverage', 'html'],
		preprocessors: {
			'../app/js/*.js': 'coverage'
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},
		htmlReporter: {
			outputFile: 'results/unit-tests.html',
			check: {
			    global: {
			    	statements: 50,
			    	branches: 50,
			    	functions: 50,
			    	lines: 50
			    }
			}
		}
	});
};