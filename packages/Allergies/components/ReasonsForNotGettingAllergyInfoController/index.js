import { app } from "../../module";
import template from "./template.html";

//*******PURPOSE: The purpose of the controller is used to View the Allergies Asked but Unknown Allergies Info
//*******EFFECTIVE FILES: Views/Allergies/..
//*******CREATED BY: Anusha Ch
//*******CREATED DATE: 02/24/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



app.component('allergies-reasons-for-not-getting-info', {
    template: template,
    controller: 'ReasonsForNotGettingAllergyInfoController'
})

app.controller('ReasonsForNotGettingAllergyInfoController', ["$scope", 'ModalPopupService', 'AllergiesService', '$timeout', function ($scope, ModalPopupService, AllergiesService, $timeout) {

    this.$onInit = function () {
        $scope.reasonsForNotGettingAllergyInfoPageInit();
    }

    //page init metod
    $scope.reasonsForNotGettingAllergyInfoPageInit = function () {
        $scope.ReasonsForNotGettingAllergyInfoWidgets = {};
        $scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick = true;
        $scope.reasonsForNotGettingAllergyMoreOptions = "Detail View";
    };

    //data that is need to show in the grid
    $scope.reasonsForNotGettingAllergyInfoInfo = [
                  { AllergiesInfo : "Patients comatosed" },
                  { AllergiesInfo : "Patient Confused" },
                  { AllergiesInfo : "Interpretor not available" },
    ];


    //kendo grid options 
    $scope.reasonsForNotGettingAllergyGridOptionsDataSource = new kendo.data.DataSource({
        data: $scope.reasonsForNotGettingAllergyInfoInfo,//assigning null on default       
    });
    
    $scope.reasonsForNotGettingAllergyGridOptions = {
        dataSource: $scope.reasonsForNotGettingAllergyGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        selectable: "single row",
        columns: [
        {
            field: "AllergiesInfo",
            title: "Reasons",
        },

        ]
    };

    //on dataBound eent in the grid
    $scope.reasonsForNotGettingAllergyGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 28402);
        }

    };

    //on dataBound event in the grid
    $scope.reasonsForNotGettingAllergyGridOptions.change = function (e) {
        var grid = $scope.ReasonsForNotGettingAllergyInfoWidgets.ReasonsForNotGettingAllergyInfoGrid;
        $scope.reasonFortGettingSelectedItem = grid.dataItem(grid.select());
        if ($scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick) {
            $scope.reasonsForNotGettingAllergyClick();//raising the click
        }        
        //$scope.OK(selecctedItem);
    };


    //###################   METHOD TO HIDE SELETED OPTIONS BLOCK START  #########################
    $scope.reasonsForNotGettingAllergyViewClick = function () {
        if ($scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick == true) {
            $("#btnReasonsForNotGettingAllergyMoreOptions").removeClass("DetailIcon").addClass("BriefIcon");
            $scope.reasonsForNotGettingAllergyMoreOptions = "Brief View";
            $("#divReasonsForNotGettingAllergyEnterReason").show();
            $("#divReasonsForNotGettingAllergyOkButton").show();
            $scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick = false;
            $scope.reasonForNotGettingAllergyInfoFromPatientFocus = true;
        }

        else {
            $("#btnReasonsForNotGettingAllergyMoreOptions").removeClass("BriefIcon").addClass("DetailIcon");
            $scope.reasonsForNotGettingAllergyMoreOptions = "Detail View";
            $("#divReasonsForNotGettingAllergyEnterReason").hide();
            $("#divReasonsForNotGettingAllergyOkButton").hide();
            $scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick = true;
        }

    };
    // ###################  METHOD TO HIDE SELETED OPTIONS BLOCK END #########################




    //this method is useful in saving the reason for not getting the allergy information with the reason seledcted ort entered by the user
    $scope.reasonsForNotGettingAllergyClick = function () {

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentId,
            Allergen_TypeID: 1 //for not getting allergyinfo
        };


        if (!$scope.reasonsForNotGettingAllergyViewDetailandBriefViewIconClick) {
            if (!hasValue($scope.reasonForNotGettingAllergyInfoFromPatient) && !hasValue($scope.reasonFortGettingSelectedItem)) {
                ShowErrorMessage('Please Select/Enter a Reason.');
                $timeout(function () {
                    $scope.reasonForNotGettingAllergyInfoFromPatientFocus = true;
                   
                },500)
                return;
            }
            else if (hasValue($scope.reasonForNotGettingAllergyInfoFromPatient)) {
                postData.AllergiesFreeText = "Unable to Get Allergy Info - " + $scope.reasonForNotGettingAllergyInfoFromPatient;
            }
        }
        else {
            if (!hasValue($scope.reasonFortGettingSelectedItem)) {
                ShowErrorMessage('Please Select a Reason.');
                return;
            }
            postData.AllergiesFreeText = "Unable to Get Allergy Info - " + $scope.reasonFortGettingSelectedItem.AllergiesInfo;
        }


        AllergiesService.allergiesSaveorUpdatePatientAllergiesFreeTextInformation(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.OK();
        });
        

    };

    //AllergiesService



    //$scope.reasonsForNotGettingAllergyInfoPageInit();
}]);