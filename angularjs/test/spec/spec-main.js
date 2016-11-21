describe('fileSelector', function () {

	var $compile, $rootScope, directiveElem, result;

	beforeEach(module("fileSelector"));

	beforeEach(function(){
	  
		inject(function(_$compile_, _$rootScope_, _$httpBackend_){
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$httpBackend = _$httpBackend_				
		});

	});

	it('placeholder', function () {
  		expect(true).toBeDefined();
	});
 

});
