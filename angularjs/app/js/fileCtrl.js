app.controller('fileCtrl', fileCtrl);
fileCtrl.$inject = ['$scope', '$log', '$q', '$sce', '$filter'];

function fileCtrl($scope, $log, $q, $sce, $filter) {

    $scope.createPatientObject = function createPatientObject(file){
        var patient = {};

        patient.patient = true;
        // Generate Unique ID 
        if (file.patientID && (file.patientID.indexOf(".") > 0)){
            patient.id = 'u' + file.patientID.split('.').join('');
        }else{
            patient.id = 'u' + file.patientID;
        }
        patient.patientID = file.patientID;
        patient.selected = true;
        patient.patientName = file.patientName;
        patient.gender = file.gender;
        patient.dob = file.dob;
        patient.age = file.age;
        return patient;
    };

    $scope.createStudyObject = function createStudyObject(file){
        var study = {};

        study.UID = file.studyUID;
        study.numoffiles = 0;
        study.study = true;
        if (file.studyUID && (file.studyUID.indexOf(".") > 0)){
            study.id = 'u' + file.studyUID.split('.').join('');
        }else{
            study.id = 'u' + file.studyUID;
        }
        study.studyDescription = file.studyDescription;
        study.modality = file.modality;
        study.studyDate = file.studyDate;
        study.selected = true;
        return study;
    };

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

                        if (typeof response.x0020000e !== "object"){

                            if ((typeof response.x00080018 !== "object" && response.x00080018 !== null && response.x00080018 !== undefined) !== false) {
                                file.UID = response.x00080018;
                                if (file.UID.indexOf(".") > 0){
                                    file.id =  'u' + response.x00080018.split('.').join('');
                                }else{
                                    file.id = 'u' + file.patientID;
                                }
                            }
                            if ((typeof response.x00100010 !== "object" && response.x00100010 !== null && response.x00100010 !== undefined) !== false) {
                                file.patientName = response.x00100010;
                            }
                            if ((typeof response.x00100040 !== "object" && response.x00100040 !== null  && response.x00100040 !== undefined) !== false) {
                                file.gender = response.x00100040;
                            }else{
                                file.gender = "";
                            }
                            if ((typeof response.x00100030 !== "object" && response.x00100030 !== null && response.x00100030 !== undefined) !== false) {
                                if (response.x00100030 === "00010101"){
                                    file.dob = "00010101";
                                }else{
                                    year = parseInt(response.x00100030.substring(0, 4));
                                    month = parseInt(response.x00100030.substring(4, 6)) - 1;
                                    day = parseInt(response.x00100030.substring(6, 8));
                                    dateObject = new Date(Date.UTC(year,month,day,12,0,0));
                                    file.dob = $filter('date')(dateObject, 'MMM d, y');
                                }
                            }
                            if ((typeof response.x00101010 !== "object" && response.x00101010 !== null && response.x00101010 !== undefined) !== false) {
                                file.age = response.x00101010;
                            }else{
                                file.age = "";
                            }
                            if ((typeof response.x0020000d !== "object" && response.x0020000d !== null  && response.x0020000d !== undefined) !== false) {
                                file.studyUID = response.x0020000d;
                            }
                            if ((typeof response.x0020000e !== "object" && response.x0020000e !== null && response.x0020000e !== undefined) !== false) {
                                file.seriesUID = response.x0020000e;
                            }
                            if ((typeof response.x00081030 !== "object" && response.x00081030 !== null && response.x00081030 !== undefined) !== false) {
                                file.studyDescription = response.x00081030;
                            }
                            if ((typeof response.x00080060 !== "object" && response.x00080060 !== null && response.x00080060 !== undefined) !== false) {
                                file.modality = response.x00080060;
                            }
                            if ((typeof response.x00080020 !== "object" && response.x00080020 !== null && response.x00080020 !== undefined) !== false) {
                                if (response.x00080020 === "00010101"){
                                    file.studyDate = "00010101";
                                }else{
                                    year = parseInt(response.x00080020.substring(0, 4));
                                    month = parseInt(response.x00080020.substring(4, 6)) - 1;
                                    day = parseInt(response.x00080020.substring(6, 8));
                                    dateObject = new Date(Date.UTC(year,month,day,12,0,0));
                                    file.studyDate = $filter('date')(dateObject, 'MMM d, y');
                                }
                            }
                            if ((typeof response.x00100020 !== "object" && response.x00100020 !== null && response.x00100020 !== undefined) !== false) {
                                file.patientID = response.x00100020;   
                            }                                                           

                            file.label = file.name;
                            file.selected = true;
                            success = true;

                            if (files.length >= 1){
                                
                                // Set last patient since there is at least 1 patient
                                lastPatient = files[(files.length - 1)];

                                if (lastPatient.patientID === file.patientID){
                                    
                                    // Set last study since there is at least 1 study
                                    lastStudy = lastPatient.children[(lastPatient.children.length - 1)];

                                    if (lastStudy.UID === file.studyUID){
                                        
                                        // Bind to existing study and patient
                                        lastStudy.numoffiles = lastStudy.numoffiles + 1;
                                        lastStudy.children.push(file);
                                        
                                    }else{

                                        // Bind to existing patient but make new study
                                        study = $scope.createStudyObject(file);
                                        study.children = [file];
                                        study.numoffiles = study.numoffiles + 1;
                                        lastPatient.children.push(study);
            
                                    }

                                }else{

                                    // Make New Study And Patient
                                    study = $scope.createStudyObject(file);
                                    patient = $scope.createPatientObject(file);
                                    study.children = [file];
                                    patient.children = [study];
                                    files.push(patient);

                                }

                            }else{

                                // Make New Study And Patient
                                study = $scope.createStudyObject(file);
                                patient = $scope.createPatientObject(file);
                                study.children = [file];
                                patient.children = [study];
                                files.push(patient);

                            }

                    }else{
                        // Not a Valid Dicom File Does not Contain Object
                        success = false;
                    }
                // End Then Start Catch    
                }).catch(function parseFailure(response) {
                    // Invalid File Parsing Failed and Not valid
                    if ( (file.type.indexOf('jpeg') > 0) || (file.type.indexOf('jpg') > 0) || (file.type.indexOf('mpeg') > 0) || (file.type.indexOf('mov') > 0) || (file.type.indexOf('mp4') > 0)) {
                        // Failed Parse on a JPEG Eventually I need to pass in DICOMDIR Info if avaliable to here.

                        file.patientName = "Unknown Patient";
                        file.studyUID = "Unknown.";
                        file.gender = "";
                        file.age = "";
                        file.patientID = "Unknown.";
                        file.id = file.name;
                        file.label = file.name;
                        file.selected = true;

                        success = true;

                        if (files.length >= 1){
                                
                                // Set last patient since there is at least 1 patient
                                lastPatient = files[(files.length - 1)];

                                if (lastPatient.patientID === file.patientID){
                                    
                                    // Set last study since there is at least 1 study
                                    lastStudy = lastPatient.children[(lastPatient.children.length - 1)];

                                    if (lastStudy.UID === file.studyUID){
                                        
                                        // Bind to existing study and patient
                                        lastStudy.numoffiles = lastStudy.numoffiles + 1;
                                        lastStudy.children.push(file);
                                        
                                    }else{

                                        // Bind to existing patient but make new study
                                        study = $scope.createStudyObject(file);
                                        study.children = [file];
                                        study.numoffiles = study.numoffiles + 1;
                                        lastPatient.children.push(study);
            
                                    }

                                }else{

                                    // Make New Study And Patient
                                    study = $scope.createStudyObject(file);
                                    patient = $scope.createPatientObject(file);
                                    study.children = [file];
                                    patient.children = [study];
                                    files.push(patient);

                                }

                            }else{

                                // Make New Study And Patient
                                study = $scope.createStudyObject(file);
                                patient = $scope.createPatientObject(file);
                                study.children = [file];
                                patient.children = [study];
                                files.push(patient);

                            }

                    }else{
                        // Not a valid file type count as failure and move on.
                        success = false;
                    }
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