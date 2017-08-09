app.controller('fileCtrl', fileCtrl);
fileCtrl.$inject = ['$scope', '$log', '$q', '$sce', '$filter'];

function fileCtrl($scope, $log, $q, $sce, $filter) {

    $scope.parseFolder = function parseFolder(folder, configs){
        $scope.uploaderDisabled = "";
        $scope.filesParsed = [0,0,0]; 
        var files = [];
        var len = folder.length;

        //  angular.forEach(folder, function(value, key, obj) {
        for(var i = 0; i < len; i++){
            var success;
            var file = folder[i];

            // Catch Common Errors Before Parsing.
            if (file.name.endsWith('.DS_Store')){
                $scope.filesParsed[2] = $scope.filesParsed[2] + 1;
            }else if (file.name.endsWith('oly')){
                $scope.filesParsed[2] = $scope.filesParsed[2] + 1;
            }else if (file.name.endsWith('xmd')){
                $scope.filesParsed[2] = $scope.filesParsed[2] + 1;          
            }else if ( ((file.type.indexOf('jpeg') > 0) || (file.type.indexOf('jpg') > 0)) ){
                $scope.filesParsed[2] = $scope.filesParsed[2] + 1;
            }else if ( ((file.type.indexOf('mpeg') > 0) || (file.type.indexOf('mpg') > 0) || (file.type.indexOf('mov') > 0) || (file.type.indexOf('mp4') > 0)) ){
                $scope.filesParsed[2] = $scope.filesParsed[2] + 1;
            }else{
                $scope.parseFile(file).then(
                    function parseSuccess(response){
                        var parsed = {};
                        var dateObject;
                        success = true;
                        files.push(file);  
                        $scope.parseUpdate();                                                     

                // End Then Start Catch    
                }).catch(function parseFailure(response) {
                    
                    success = false;

                }).finally(function () {

                    if (success){
                        $scope.filesParsed[0] = $scope.filesParsed[0] + 1;   
                    }else{
                        $scope.filesParsed[1] = $scope.filesParsed[1] + 1;
                    }
                    $scope.parseUpdate();

                });   // End Finally           
            } // End If Else Logic

        }   // End ForEach
        $scope.parseUpdate();
        return files;

    };


    $scope.parseFile = function parseFile(file){
        var deferred = $q.defer();
        var reader = new FileReader();
        var result = null;
        var blob;

            
        reader.onload = function onLoad() {
            var arrayBuffer = reader.result;
            reader = undefined;
            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here
            var byteArray = new Uint8Array(arrayBuffer);
           
                try { 
                    var options = {
                        omitPrivateAttibutes: true,
                        untilTag: 'x0020000e',
                        maxElementLength: 128
                    };
                    var dataSet = dicomParser.parseDicom(byteArray, options);
                    result = convertDataSet(dataSet);
                    deferred.resolve(result);

                } catch(e) {
                    if (e === "dicomParser.readPart10Header: DICM prefix not found at location 132 - this is not a valid DICOM P10 file."){
                        deferred.reject({message: "Invalid Dicom File", class: "black"}); 
                    }else{
                        var errormessage = null;
                        if (typeof e.exception === "object"){
                            var tempobject = e.exception;
                            errormessage = tempobject.exception;
                        }else if(typeof e.exception === "string"){
                            errormessage = e.exception;
                        }else{
                            $log.error(e);
                            errormessage = "Unknown Error";
                        }
                        deferred.reject({message: errormessage, class: "IMred"}); 
                    }
                               
                }

        };

        reader.onerror = function onerror(error) {
            reader = undefined;
            return deferred.reject(error);
        };

        var overridesize = true;

        if (file.size > 4096){
            if (overridesize){
                blob = file;
            }else if (file.size < 32768){
                blob = file;
            }else{
                blob = file.slice(0,32768);
            }

            reader.readAsArrayBuffer(blob);

        }else{
            deferred.reject({message: "File to Small", class: "IMblack"});    
        }
        
        file = undefined;
        blob = undefined;

        return deferred.promise;

    };

    function isASCII(str) {
        return /^[\x00-\x7F]*$/.test(str);
    }

    function convertDataSet(dataSet) {
        var tagsArray = ["x00100020","x00100010","x00100030","x00100040","x00101010","x0020000d","x0020000e","x00080018","x00080020","x00080060","x00081030"];
        var output = [];
        for (var propertyName in dataSet.elements) {
            // These are all the elements we care about 
            
            if (tagsArray.indexOf(propertyName) > -1){
                var element = dataSet.elements[propertyName];

                if (element.items) {
                    // Ignoring Element Items
                    break;
                }
                else if (element.fragments) {
                    // Ignoring Element Fragments
                    break;
                }
                else {
                    // if the length of the element is less than 256 we try to show it.  We put this check in
                    // to avoid displaying large strings which makes it harder to use.
                    if (element.length < 256) {

                        var str = dataSet.string(propertyName);
                        var stringIsAscii = isASCII(str);

                        if (stringIsAscii) {
                            if (str !== undefined) {
                                output[propertyName] = str;
                            }
                        }

                    }

                } // End Else

            } // End if

        } // End For

        return output;
    }

    $scope.parseUpdate = function parseUpdate(){
        var statusObject = {};
        if ($scope.filesParsed[0] > 0){
            statusObject.parsed =  $scope.filesParsed[0] + " DICOM files available for import. <br />";
        }else{
            statusObject.parsed = "0 DICOM files available for import. <br />";
        }
        if ($scope.filesParsed[1] > 0){
            statusObject.failed = $scope.filesParsed[1] + " non-conformant DICOM files. <br />";
        }else{
            statusObject.failed = "";
        }
        if ($scope.filesParsed[2] > 0){
            statusObject.skipped =  $scope.filesParsed[2] + " non-DICOM files skipped. <br />";
        }else{
            statusObject.skipped = "";
        }

        totalFilesParsed = ($scope.filesParsed[0] + $scope.filesParsed[1] + $scope.filesParsed[2]);
        
        $scope.progressBar = $sce.trustAsHtml('<progress max="' + $scope.myFolder.length + '" value="' + totalFilesParsed + '"></progress>');

        $scope.parseStatus = $sce.trustAsHtml(statusObject.parsed + statusObject.failed + statusObject.skipped);
    };

}