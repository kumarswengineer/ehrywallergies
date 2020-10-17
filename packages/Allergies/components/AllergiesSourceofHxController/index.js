import { app } from "../../module";
import template from "./index.html";


app.component('allergies-source-hx', {
    template: template,
    controller: 'AllergiesSourceofHxController'
})

//*******PURPOSE: The purpose of the controller is used to View the Allergies Source of Hx Info
//*******EFFECTIVE FILES: Views/Allergies/..
//*******CREATED BY: Priyanka G
//*******CREATED DATE: 05/27/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



app.controller('AllergiesSourceofHxController', ["$scope", 'ModalPopupService', 'AllergiesService', 'PastHistoryService', 'MedicalHistoryService', function ($scope, ModalPopupService, AllergiesService, PastHistoryService, MedicalHistoryService) {

    this.$onInit = function () {
        $scope.pastHistorySourceOfHxDetailInfoPageInit();
    }

    //INIT METHOD FOR SOURCE OF HX
    $scope.pastHistorySourceOfHxDetailInfoPageInit = function () {

        $scope.patientID = $scope.EMRDataFromPopup.PatientID;
        $scope.pastHxObjectId = $scope.EMRDataFromPopup.selectedRow.PastHxObjectID;
        $scope.pastHistoryId = $scope.EMRDataFromPopup.selectedRow.PastHistoryID;
        //CALLING THE METHOD TO GET THE PAST HISTORY SOURCE OF HX INFORMATION
        $scope.pastHistoryGetSourceOfHx();

    }

    //################### PAST HISTORY GET SOURCE OF HX INFORMATION BLOCK START #########################
    //*******PURPOSE: THIS METHOD IS USEFUL FOR GETTING THE PAST HISTORY SOURCE OF HX INFORMATION
    //*******CREATED BY:  SRINIVAS M
    //*******CREATED DATE: 06/08/2015
    //THIS METHOD IS USEFUL IN GETING THE PAST HISTORY SOURCE OF HX INFORMATION
    $scope.pastHistoryGetSourceOfHx = function () {
        PastHistoryService.PastHistoryGetPastHistorySourceOfHxInfo().then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            //$scope.allergiesSourceofHxInfo = serviceResponse;
            $scope.allergiesSourceofHxOptionsDataSource.data(serviceResponse);
        });
    }
    //################### PAST HISTORY GET SOURCE OF HX INFORMATION BLOCK END #########################

    //$scope.allergiesSourceofHxInfo = [
    //               { "SourceofHx": "aaaaa"},
    //               { "SourceofHx": "bbbbbb" },
    //               { "SourceofHx": "cccccccc" },

    //];

    $scope.allergiesSourceofHxOptionsDataSource = new kendo.data.DataSource({
        data: [],//assigning null on default       
    });

    $scope.allergiesSourceofHxGridOptions = {
        dataSource: $scope.allergiesSourceofHxOptionsDataSource,
        sortable: true,
        selectable: "single row",
        navigatable: true,
        columns: [
        {
            field: "PastHxSourceOfHx",
            title: "Source of Hx",
        },
        ]
    };

    //on dataBound eent in the grid
    $scope.allergiesSourceofHxGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
    };

    //GRID FOCUSED ROW CHANGE EVENT. TO GET THE FOCUSED ROW.
    $scope.allergiesSourceofHxGridOptions.change = function () {
        var grid = $scope.allergiesSourceofHxWidgets.grdallergiesSourceofHxList;
        $scope.pastHistorySourceofHxSelectedInGrid = grid.dataItem(grid.select());
        $scope.pastHistoryUpdateSourceOfHx();
    }

    //METHOD TO UPDATE THE SOURCE OF HX FOR THE DOCUMENTED PAST HISTORY INFORMATION
    $scope.pastHistoryUpdateSourceOfHx = function () {

        //Checking whether the Selected 
        if (hasValue($scope.pastHistorySourceofHxSelectedInGrid)) {

            switch ($scope.pastHxObjectId) {
                case 8:
                    $scope.pastHistorySourceOfHxInfoforSocialHx();
                default:

            }

        }

    }

    //UPDATING THE SOURCE OF HX ID FOR THE SOCIAL HX INFORMATION
    $scope.pastHistorySourceOfHxInfoforSocialHx = function () {

        $scope.socialHistoryAddDetailInfoSaveModel = {};//save model
        $scope.socialHistoryAddDetailInfoSaveModel.PastHxObjectID = $scope.pastHxObjectId;
        //$scope.socialHistoryDiseasesModel = {};
        //$scope.socialHistoryMoreInfo = {};
        //var socialHxDiseasesIds = [];
        //var socialHxDiseases = [];

        if (hasValue($scope.pastHistoryId)) {
            //$scope.socialHistoryMoreInfoEditModeOnLoad = true;
            //$scope.socialHistoryDiseaseInfoEditModeOnLoad = true;
            //$scope.socialHistoryAddDetailInfoSetDefaults(); //CALLING THE SET DEFAULT VALUES METHOD TO ASSIGN THE DEFAULT VALUES AT THE LOAD TIME.

            //$scope.socialHistoryAddDetailInfoPreviousInfo = $scope.EMRDataFromPopup.selectedSocialHXInfo;
            var postData = {
                PastHistoryID: $scope.pastHistoryId
            };
            PastHistoryService.PastHistoryGetPastHistoryDocumentedInformation(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;
                //$scope.socialHistoryAddDetailInfoGetCategoriesList();//get the social hx categories list on init 
                $scope.socialHistoryAddDetailInfoSaveModel = serviceResponse[0];//setting the save model as previous
                //$scope.socialHistoryPreviousSocialHxInfo = serviceResponse[0];// PastHxParentID;
                $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryTextID = undefined;
                $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryText = undefined;

                //if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseasesInfo)) {
                //    if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseasesInfo.indexOf(",") == true) {
                //        socialHxDiseasesIds = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseasesInfo.split(",");
                //    }
                //    if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseases.indexOf(",") == true) {
                //        socialHxDiseases = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseases.split(",");
                //    }
                //    if (hasValue(socialHxDiseasesIds)) {
                //        //getting the selected reason from the list
                //        for (var index in socialHxDiseasesIds) {
                //            if (socialHxDiseasesIds(index) > 0) {
                //                $scope.socialHistoryDiseasesModel.MedicalHxCategoryObjectID = socialHxDiseasesIds(index);
                //                $scope.socialHistoryDiseasesModel.MedicalHxCategoryObjectName = socialHxDiseases(index);
                //                $scope.socialHistoryDiseasesModel.add($scope.socialHistoryDiseasesModel);
                //            }
                //        }
                //    }
                //}

                //if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo)) {
                //    if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo.indexOf(",") == true) {
                //        socialHxDiseasesIds = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo.split(",");
                //    }
                //    if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo.indexOf(",") == true) {
                //        socialHxDiseases = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo.split(",");
                //    }
                //    if (hasValue(socialHxDiseasesIds)) {
                //        //getting the selected reason from the list
                //        for (var index in socialHxDiseasesIds) {
                //            if (socialHxDiseasesIds(index) > 0) {
                //                $scope.socialHistoryMoreInfo.MedicalHxCategoryObjectID = socialHxDiseasesIds(index);
                //                $scope.socialHistoryMoreInfo.MedicalHxCategoryObjectName = socialHxDiseases(index);
                //                $scope.socialHistoryMoreInfo.add($scope.socialHistoryMoreInfo);
                //            }
                //        }
                //    }
                //}

                if (hasValue($scope.socialHistoryDiseasesModel)) {
                    $scope.socialHistoryAddDetailInfoSaveModel.PastHxModelForDisease = $scope.socialHistoryDiseasesModel;
                }

                if (hasValue($scope.socialHistoryMoreInfo)) {
                    $scope.socialHistoryAddDetailInfoSaveModel.PastHxModelForMoreInfo = $scope.socialHistoryMoreInfo;
                }

                var prevSelectedDiseaseItems = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryDiseasesInfo.split(",");
                if (prevSelectedDiseaseItems.length > 1 && !hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryMoreInfo)) {
                    $("#moreInfoPanel").css("display", "none");
                    $("#diseasePanel").removeClass("colReq-sm-6").addClass("col-sm-12");
                    $("#moreInfoPanel").removeClass("colReq-sm-6");
                    $scope.socialHistoryAddDetailInfoMoreInfoShow = false;
                }

                if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate)) {
                    $scope.socialHistoryAddDetailInfoSmokingCategory = true;
                    if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat)) {
                        if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat == 1) {
                            $scope.socialHistoryAddDetailInfoStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("MM/yyyy");
                            var prevStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate);
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("MM/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStartDate = new Date(prevStartDate).getFormat("MM/dd/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat = 1;//month format
                        }
                        else {
                            $scope.socialHistoryAddDetailInfoStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("yyyy");
                            var prevStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate);
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStartDate = new Date(prevStartDate).getFormat("MM/dd/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat = 2;//year format
                        }
                    }
                    else if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat) && $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDateFormat == 2) {
                        $scope.socialHistoryAddDetailInfoStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("yyyy");
                        var prevStartdate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate);
                        $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStartDate).getFormat("yyyy");

                        prevStartdate.setDate(new Date(adminGetCurrentDate()).getDate());
                        prevStartdate.setMonth(new Date(adminGetCurrentDate()).getMonth());

                        $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStartDate = new Date(prevStartdate).getFormat("MM/dd/yyyy");
                    }
                }

                if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate)) {
                    $scope.socialHistoryAddDetailInfoSmokingCategory = true;
                    if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat)) {
                        if ($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat == 1) {
                            var prevStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate);
                            $scope.socialHistoryAddDetailInfoStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("MM/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("MM/yyyy");

                            $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStopDate = new Date(prevStopDate).getFormat("MM/dd/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat = 1;//month format
                        }
                        else {
                            var prevStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate);
                            $scope.socialHistoryAddDetailInfoStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("yyyy");

                            $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStopDate = new Date(prevStopDate).getFormat("MM/dd/yyyy");
                            $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat = 2;//year format
                        }
                    }
                    else if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat) && $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDateFormat == 2) {
                        var prevStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate);

                        $scope.socialHistoryAddDetailInfoStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("yyyy");
                        $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate = new Date($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryStopDate).getFormat("yyyy");
                        prevStopDate.setDate(new Date(adminGetCurrentDate()).getDate());
                        prevStopDate.setMonth(new Date(adminGetCurrentDate()).getMonth());
                        $scope.socialHistoryAddDetailInfoSaveModel.pastHxSocialHxSmokingStopDate = new Date(prevStopDate).getFormat("MM/dd/yyyy");
                    }
                }

                if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryXYears) && $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryXYears > 0) {
                    $scope.socialHistoryAddDetailInfoSmokingCategory = false;
                    $scope.socialHistorySelectedDuration = $scope.socialHistoryAddDetailInfoSaveModel.PastHxYearsCategoryName;

                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearAgoName = $scope.socialHistoryAddDetailInfoSaveModel.PastHxYearsCategoryName;
                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearAgoID = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryXYears;

                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearName = undefined;
                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearID = undefined;
                }

                if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.PastHistoryYearsAgo) && $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryYearsAgo > 0) {
                    $scope.socialHistoryAddDetailInfoSmokingCategory = false;
                    $scope.socialHistorySelectedDuration = $scope.socialHistoryAddDetailInfoSaveModel.PastHxYearsAgoCategoryName;

                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearName = $scope.socialHistoryAddDetailInfoSaveModel.PastHxYearsAgoCategoryName;
                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearID = $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryYearsAgo;

                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearAgoName = undefined;
                    $scope.socialHistoryAddDetailInfoSaveModel.MedicalHxModelForAbsoluteDurationYearAgoID = undefined;
                }

                if (hasValue($scope.socialHistoryAddDetailInfoSaveModel.Comments)) {
                    $scope.socialHistoryComments = $scope.socialHistoryAddDetailInfoSaveModel.Comments;
                }

            });
        }

        //##################### ASSIGNING THE VALUES TO THE MODEL START BLOCK ########################################
        ////$scope.socialHistoryAddDetailInfoSaveModel.PastHxCategoryObjectID = parseInt($scope.socialHistorySelectedCategory);
        ////$scope.socialHistoryAddDetailInfoSaveModel.PastHxParentID = parseInt($scope.socialHistorySelectedCategory);

        //////if the more info grid is visible then only sending the selected items from the grid
        ////if ($scope.socialHistoryAddDetailInfoMoreInfoShow) {
        ////    var selectedMoreInfoItems = getSelectedRowsFromGrid($scope.socialHistoryDetailWidgets.grdSocialHistoryMoreInfoList);//getting the selected rows from the grid
        ////    $scope.socialHistoryAddDetailInfoSaveModel.PastHxModelForMoreInfo = selectedMoreInfoItems;//setting the save model
        ////}
        //////if comments are entered then only saving the comments
        ////if (hasValue($scope.socialHistoryComments))
        ////    $scope.socialHistoryAddDetailInfoSaveModel.Comments = $scope.socialHistoryComments;

        ////$scope.socialHistoryAddDetailInfoSaveModel.EMRServerDateTime = adminGetCurrentDateAndTime();//sending the emr SERVER date time

        //////ASSINGING THE PASTHISTORYID IN THE EDIT MODE
        ////if (hasValue($scope.socialHistoryAddDetailInfoPreviousInfo) && $scope.socialHistoryAddDetailInfoPreviousInfo.PastHistoryID > 0) {
        ////    $scope.socialHistoryAddDetailInfoSaveModel.PastHistoryID = $scope.socialHistoryAddDetailInfoPreviousInfo.PastHistoryID;
        ////    if (hasValue($scope.socialHistoryPatientInfo.AppointmentId)) {
        ////        $scope.socialHistoryAddDetailInfoSaveModel.AppointmentID = $scope.socialHistoryPatientInfo.AppointmentId;
        ////    }
        ////    else {
        ////        $scope.socialHistoryAddDetailInfoSaveModel.AppointmentID = 0;
        ////    }
        ////    //for only physician
        ////    if (EMRPracticeModel.UserType != 0)
        ////        $scope.socialHistoryAddDetailInfoSaveModel.PastHxOrderedByID = EMRPracticeModel.LoggedUserID;
        ////    else {

        ////        if (hasValue($scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID) && $scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID > 0)
        ////            $scope.socialHistoryAddDetailInfoSaveModel.PastHxOrderedByID = $scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID;
        ////        else {
        ////            ShowErrorMessage('Please Select Physician.');
        ////            return;
        ////        }
        ////    }

        ////}

        $scope.socialHistoryAddDetailInfoSaveModel.EMRServerDateTime = adminGetCurrentDateAndTime();//sending the emr SERVER date time

        //for only physician
        if (EMRPracticeModel.UserType != 0)
            $scope.socialHistoryAddDetailInfoSaveModel.PastHxOrderedByID = EMRPracticeModel.LoggedUserID;
        else {

            if (hasValue($scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID) && $scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID > 0)
                $scope.socialHistoryAddDetailInfoSaveModel.PastHxOrderedByID = $scope.socialHistoryPatientInfo.SecretarySelectedPhysicinID;
            //else {
            //    ShowErrorMessage('Please Select Provider.');
            //    return;
            //}
        }

        //##################### ASSIGNING THE VALUES TO THE MODEL END BLOCK ########################################

        $scope.socialHistoryAddDetailInfoSaveModel.PastHxSourceOfHXID = $scope.pastHistorySourceofHxSelectedInGrid.PastHxSourceOfHxID;

        MedicalHistoryService.medicalHistorySavePastHx($scope.socialHistoryAddDetailInfoSaveModel).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.OK();//closing the popup 
        });
    }

    //CALLING THE PAGE INIT METHOD
    //$scope.pastHistorySourceOfHxDetailInfoPageInit();

}]);