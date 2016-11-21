function appConfig(e){"use strict";e.debugInfoEnabled(!1)}function fileModel(e,t,i){return{restrict:"A",link:function(t,i,n){var s=e(n.fileModel),a=s.assign;"object"!=typeof t.configs?configs=t.configs:(configs.customerConfigs={},configs.customerConfigs.uploader={},configs.customerConfigs.uploader.jpeg=!1,configs.customerConfigs.uploader.mpeg=!1),i.bind("change",function(e){t.$apply(function(){a(t,i[0].files),t.folder=t.parseFolder(t.myFolder,configs)})})}}}function fileCtrl(e,t,i,n,s){function a(e){return/^[\x00-\x7F]*$/.test(e)}function r(e){var t=["x00100020","x00100010","x00100030","x00100040","x00101010","x0020000d","x0020000e","x00080018","x00080020","x00080060","x00081030"],i=[];for(var n in e.elements)if(t.indexOf(n)>-1){var s=e.elements[n];if(s.items)break;if(s.fragments)break;if(s.length<256){var r=e.string(n),d=a(r);d&&void 0!==r&&(i[n]=r)}}return i}e.createPatientObject=function(e){var t={};return t.patient=!0,e.patientID&&e.patientID.indexOf(".")>0?t.id="u"+e.patientID.split(".").join(""):t.id="u"+e.patientID,t.patientID=e.patientID,t.selected=!0,t.patientName=e.patientName,t.gender=e.gender,t.dob=e.dob,t.age=e.age,t},e.createStudyObject=function(e){var t={};return t.UID=e.studyUID,t.numoffiles=0,t.study=!0,e.studyUID&&e.studyUID.indexOf(".")>0?t.id="u"+e.studyUID.split(".").join(""):t.id="u"+e.studyUID,t.studyDescription=e.studyDescription,t.modality=e.modality,t.studyDate=e.studyDate,t.selected=!0,t},e.parseFolder=function(t,i){e.uploaderDisabled="",e.filesParsed=[0,0,0];for(var n=[],a=t.length,r=0;r<a;r++){var d,l=t[r];l.name.endsWith(".DS_Store")?e.filesParsed[2]=e.filesParsed[2]+1:l.name.endsWith("oly")?e.filesParsed[2]=e.filesParsed[2]+1:l.name.endsWith("xmd")?e.filesParsed[2]=e.filesParsed[2]+1:l.type.indexOf("jpeg")>0||l.type.indexOf("jpg")>0?e.filesParsed[2]=e.filesParsed[2]+1:l.type.indexOf("mpeg")>0||l.type.indexOf("mpg")>0||l.type.indexOf("mov")>0||l.type.indexOf("mp4")>0?e.filesParsed[2]=e.filesParsed[2]+1:e.parseFile(l).then(function(t){var i;"object"!=typeof t.x0020000e?(("object"!=typeof t.x00080018&&null!==t.x00080018&&void 0!==t.x00080018)!=!1&&(l.UID=t.x00080018,l.UID.indexOf(".")>0?l.id="u"+t.x00080018.split(".").join(""):l.id="u"+l.patientID),("object"!=typeof t.x00100010&&null!==t.x00100010&&void 0!==t.x00100010)!=!1&&(l.patientName=t.x00100010),("object"!=typeof t.x00100040&&null!==t.x00100040&&void 0!==t.x00100040)!=!1?l.gender=t.x00100040:l.gender="",("object"!=typeof t.x00100030&&null!==t.x00100030&&void 0!==t.x00100030)!=!1&&("00010101"===t.x00100030?l.dob="00010101":(year=parseInt(t.x00100030.substring(0,4)),month=parseInt(t.x00100030.substring(4,6))-1,day=parseInt(t.x00100030.substring(6,8)),i=new Date(Date.UTC(year,month,day,12,0,0)),l.dob=s("date")(i,"MMM d, y"))),("object"!=typeof t.x00101010&&null!==t.x00101010&&void 0!==t.x00101010)!=!1?l.age=t.x00101010:l.age="",("object"!=typeof t.x0020000d&&null!==t.x0020000d&&void 0!==t.x0020000d)!=!1&&(l.studyUID=t.x0020000d),("object"!=typeof t.x0020000e&&null!==t.x0020000e&&void 0!==t.x0020000e)!=!1&&(l.seriesUID=t.x0020000e),("object"!=typeof t.x00081030&&null!==t.x00081030&&void 0!==t.x00081030)!=!1&&(l.studyDescription=t.x00081030),("object"!=typeof t.x00080060&&null!==t.x00080060&&void 0!==t.x00080060)!=!1&&(l.modality=t.x00080060),("object"!=typeof t.x00080020&&null!==t.x00080020&&void 0!==t.x00080020)!=!1&&("00010101"===t.x00080020?l.studyDate="00010101":(year=parseInt(t.x00080020.substring(0,4)),month=parseInt(t.x00080020.substring(4,6))-1,day=parseInt(t.x00080020.substring(6,8)),i=new Date(Date.UTC(year,month,day,12,0,0)),l.studyDate=s("date")(i,"MMM d, y"))),("object"!=typeof t.x00100020&&null!==t.x00100020&&void 0!==t.x00100020)!=!1&&(l.patientID=t.x00100020),l.label=l.name,l.selected=!0,d=!0,n.length>=1?(lastPatient=n[n.length-1],lastPatient.patientID===l.patientID?(lastStudy=lastPatient.children[lastPatient.children.length-1],lastStudy.UID===l.studyUID?(lastStudy.numoffiles=lastStudy.numoffiles+1,lastStudy.children.push(l)):(study=e.createStudyObject(l),study.children=[l],study.numoffiles=study.numoffiles+1,lastPatient.children.push(study))):(study=e.createStudyObject(l),patient=e.createPatientObject(l),study.children=[l],patient.children=[study],n.push(patient))):(study=e.createStudyObject(l),patient=e.createPatientObject(l),study.children=[l],patient.children=[study],n.push(patient))):d=!1})["catch"](function(t){l.type.indexOf("jpeg")>0||l.type.indexOf("jpg")>0||l.type.indexOf("mpeg")>0||l.type.indexOf("mov")>0||l.type.indexOf("mp4")>0?(l.patientName="Unknown Patient",l.studyUID="Unknown.",l.gender="",l.age="",l.patientID="Unknown.",l.id=l.name,l.label=l.name,l.selected=!0,d=!0,n.length>=1?(lastPatient=n[n.length-1],lastPatient.patientID===l.patientID?(lastStudy=lastPatient.children[lastPatient.children.length-1],lastStudy.UID===l.studyUID?(lastStudy.numoffiles=lastStudy.numoffiles+1,lastStudy.children.push(l)):(study=e.createStudyObject(l),study.children=[l],study.numoffiles=study.numoffiles+1,lastPatient.children.push(study))):(study=e.createStudyObject(l),patient=e.createPatientObject(l),study.children=[l],patient.children=[study],n.push(patient))):(study=e.createStudyObject(l),patient=e.createPatientObject(l),study.children=[l],patient.children=[study],n.push(patient))):d=!1})["finally"](function(){d?e.filesParsed[0]=e.filesParsed[0]+1:e.filesParsed[1]=e.filesParsed[1]+1,e.parseUpdate()})}return e.parseUpdate(),n},e.parseFile=function(e){var n,s=i.defer(),a=new FileReader,d=null;a.onload=function(){var e=a.result;a=void 0;var i=new Uint8Array(e);try{var n={omitPrivateAttibutes:!0,untilTag:"x0020000e",maxElementLength:128},l=dicomParser.parseDicom(i,n);d=r(l),s.resolve(d)}catch(o){if("dicomParser.readPart10Header: DICM prefix not found at location 132 - this is not a valid DICOM P10 file."===o)s.reject({message:"Invalid Dicom File","class":"black"});else{var f=null;if("object"==typeof o.exception){var p=o.exception;f=p.exception}else"string"==typeof o.exception?f=o.exception:(t.error(o),f="Unknown Error");s.reject({message:f,"class":"IMred"})}}},a.onerror=function(e){return a=void 0,s.reject(e)};var l=!0;return e.size>4096?(n=l?e:e.size<32768?e:e.slice(0,32768),a.readAsArrayBuffer(n)):s.reject({message:"File to Small","class":"IMblack"}),e=void 0,n=void 0,s.promise},e.parseUpdate=function(){var t={};e.filesParsed[0]>0?t.parsed=e.filesParsed[0]+" DICOM files available for import. <br />":t.parsed="0 DICOM files available for import. <br />",e.filesParsed[1]>0?t.failed=e.filesParsed[1]+" non-conformant DICOM files. <br />":t.failed="",e.filesParsed[2]>0?t.skipped=e.filesParsed[2]+" non-DICOM files skipped. <br />":t.skipped="",totalFilesParsed=e.filesParsed[0]+e.filesParsed[1]+e.filesParsed[2],e.progressBar=n.trustAsHtml('<progress max="'+e.myFolder.length+'" value="'+totalFilesParsed+'"></progress>'),e.parseStatus=n.trustAsHtml(t.parsed+t.failed+t.skipped)}}var app=angular.module("fileSelector",[]);app.config(appConfig),appConfig.$inject=["$compileProvider"],app.directive("fileModel",fileModel),fileModel.$inject=["$parse","$log","$q"],String.prototype.endsWith||(String.prototype.endsWith=function(e,t){var i=this.toString();("number"!=typeof t||!isFinite(t)||Math.floor(t)!==t||t>i.length)&&(t=i.length),t-=e.length;var n=i.indexOf(e,t);return n!==-1&&n===t}),app.controller("fileCtrl",fileCtrl),fileCtrl.$inject=["$scope","$log","$q","$sce","$filter"];