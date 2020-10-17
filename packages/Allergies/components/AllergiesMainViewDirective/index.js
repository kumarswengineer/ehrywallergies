import { app } from "../../module";
import template from "./index.html";

//*******PURPOSE: This Controller Is created for Allergies
//*******EFFECTIVE FILES: 
//*******CREATED BY: Anusha Ch
//*******CREATED DATE:08/25/2016
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

angular.module('EMR.Admin').directive('emrAllergiesMainViewDirective', function () {
    return ({
        restrict: 'AE',
        transclude: true,
        replace: true,
        // templateUrl: GetEMRPageURLByPageName("EMRWEB/Allergies/AllergiesMainViewDirective.html"),
        template: template,
        controller: "AllergiesMainViewDirectiveController",//controller to bind
        controllerAs: "vm",bindToController: true,//
        scope: {
            /* NOTE: Normally I would set my attributes and bindings
            to be the same name but I wanted to delineate between 
            parent and isolated scope. */
            //isolatedAttributeFoo:'@attributeFoo',
            //emrPatientChartOptions: '=options',//this is readed from the controller
            // isolatedExpressionFoo:'&'
        },

        link: {

            //this method executes when the link function has started
            pre: function preLink($scope, $iElement, $iAttrs, $controller) {

            },
            //after compilation/binding of the data has completed this method is executed
            post: function postLink($scope, $iElement, $iAttrs, $controller) {

                //on destroy clearing the events on nodes and removing the elements from the DOM
                $iElement.on('$destroy', function () {

                    ehrDirectiveElementsOnDestroyEvent($iElement);
                });

            }
        },
    })
}).controller('AllergiesMainViewDirectiveController', ["$scope", 'ModalPopupService', 'AllergiesService', 'EMRCommonFactory', function ($scope, ModalPopupService, AllergiesService, EMRCommonFactory) {

    this.$onInit = function () {
        $scope.allergiesMainViewDirectivePageInIt();
    }

    //################### PAGE INIT BLOCK START #########################
    //*******PURPOSE: This is used for page initializAtion
    //*******CREATED BY: Anusha Ch
    //*******CREATED DATE:08/25/2016
    $scope.allergiesMainViewDirectivePageInIt = function () {
        //ASSIGNING GUID
        $scope.AllergiesMainViewDirectiveGUID = adminGetGUID();
        //INITIALISING WIDGETS
        $scope.allergiesMainViewDirectiveMainGridWidgets = {};

        if (hasValue($scope.$parent.EMRDataFromPopup) && hasValue($scope.$parent.EMRDataFromPopup.PatientInfo)) {
            $scope.allergiesMainViewSelectedPatientInfo = $scope.$parent.EMRDataFromPopup.PatientInfo;
        }

        $scope.allergiesMainviewDirectiveHeader = "Allergies Information for " + $scope.allergiesMainViewSelectedPatientInfo.PersonLastNameFirstName;

        //calling the service to get the patient allergies information
        $scope.allergiesMainViewGetPastHistoryAllergiesList(true);
    };
    //################### PAGE INIT BLOCK END #########################

    //$scope.allergiesMainViewDirectiveMainGridInfo = [
    //    { "Allergies": "Test", },

    //]
    //Data Source
    $scope.allergiesMainViewDirectiveMainGridDataSource = new kendo.data.DataSource({
        //  data: $scope.allergiesMainViewDirectiveMainGridInfo,// $scope.selectFormtoCopy,
        data: [],
    });


    //*******KENDO GRID BINDING BLOCK START*******
    //*******CREATED BY: Anusha Ch
    //*******CREATED DATE:08/25/2016
    //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    $scope.allergiesMainViewDirectiveMainGridOptions = {
        dataSource: $scope.allergiesMainViewDirectiveMainGridDataSource,//assigning the data source
        sortable: true,
        navigatable: true,
        selectable: "single row",
        columns: [
              {
                  field: 'AllergyInfo',
                  title: 'Allergie(s)',
                  template: "<div title='#=AllergyInfo#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=AllergyInfo#</div>",

              },

        ],
    };

    $scope.allergiesMainViewDirectiveMainGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        var grid = e.sender;

        $scope.allergiesMainViewDirectiveMainGridWidgets.grdAllergiesMainViewDirectiveMainGridInfo = e.sender;

        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 159704);
        }

    };
    //*******KENDO GRID BINDING BLOCK END*******





    //################### GET ALLERGIES INFO LIST  BLOCK START #########################
    //*******PURPOSE: this method is useful in geting the allergies list from the service
    //*******CREATED BY: HEMANTH U
    //*******CREATED DATE: 08/29/2016
    //this method is useful in geting the allergies list from the service
    $scope.allergiesMainViewGetPastHistoryAllergiesList = function (allergiesMainViewDirectiveisFromLoad) {

        var serviceData = {
            PatientID: $scope.allergiesMainViewSelectedPatientInfo.PatientID,
        };

        //SEARCH BASED ON THE ALLERGY NAME
        if (hasValue($scope.allergiesMainViewDirectiveSearchAllergy)) {
            serviceData.AllergiesSearchText = $scope.allergiesMainViewDirectiveSearchAllergy;
        }

        AllergiesService.allergiesGetPatientAllergiesInfo(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesMainViewDirectiveMainGridDataSource.data(serviceResponse);

            //CHECKING WHETHER THE PATIENT IS HAVING THE ALLERGIES OR NOT. IF NO ALLERGIES EXISTS THEN OPEN THE ADD ALLERGIES WINDOW
            if (!hasValue(serviceResponse) && hasValue(allergiesMainViewDirectiveisFromLoad) && allergiesMainViewDirectiveisFromLoad == true) {
                if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-ADDALLERGIES") == EMRPermissionType.DENIED) {
                    ShowErrorMessage(EmrPermissionShowingMessage);
                    return;
                }
                $scope.allergiesMainViewDirectiveAddClickEvent();
            }
        });
    };
    //################### GET ALLERGIES INFO LIST  BLOCK END #########################



    //################### ADD ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the add new allergie for the selected patient from Past History Window
    //*******CREATED BY:  HEMANTH U
    //*******CREATED DATE: 08/29/2016
    //this method is useful in opening the add new allergie for the selected patient
    $scope.allergiesMainViewDirectiveAddClickEvent = function () {
        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-ADDALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }
        var dataToPopup = {
            PatientName: $scope.allergiesMainViewSelectedPatientInfo.PersonLastNameFirstName,
            AppointmentID: $scope.$parent.EMRDataFromPopup.AppointmentID,
            PatientID: $scope.allergiesMainViewSelectedPatientInfo.PatientID,
            CurrentAllergiesCount: $scope.allergiesMainViewDirectiveMainGridOptions.dataSource.data().length,
        };

        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/194'*/GetEMRPageURLByIndex(194), dataToPopup, 'modal-1100px').then(function (result) {
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            $scope.allergiesMainViewGetPastHistoryAllergiesList();//after successful closing refresh the list
        });
    };
    //################### ADD ALLERGIES INFO   BLOCK END #########################




    //################### EDIT ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the edit allergy popup TO EDIT THE SELECTED ALLERGY from Past History Window
    //*******CREATED BY: HEMANTH U
    //*******CREATED DATE: 08/29/2016
    //this method is useful in opening the edit allergy popup    
    $scope.allergiesMainViewDirectiveEditClickEvent = function () {
        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-EDITALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }
        var grid = $scope.allergiesMainViewDirectiveMainGridWidgets.grdAllergiesMainViewDirectiveMainGridInfo;
        if (!hasValue(grid)) return false;
        var selectedAllergy = grid.dataItem(grid.select());
        if (!hasValue(selectedAllergy)) {
            ShowErrorMessage('Please Select Allergy Information to Edit. ');
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            return false;
        }

        //NOT ALLOW TO EDIT THE ALLERGIC TO UNKNOWN DRUG.
        if (selectedAllergy.DrugID.toString() == "-666666") {
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            if (hasValue(selectedAllergy.AllergyInfo))
                ShowErrorMessage("'" + selectedAllergy.AllergyInfo + "'" + " is not allowed to Edit. ");
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            return false;
        }
        //NOT ALLOW TO EDIT THE NO KNOWN ALLERGIES(NKDA)
        if (selectedAllergy.DrugID.toString() == "999999") {
            if (hasValue(selectedAllergy.AllergyInfo))
                ShowErrorMessage("'" + selectedAllergy.AllergyInfo + "'" + " is not allowed to Edit. ");
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return false;
        }
        if (selectedAllergy.DrugID.toString() == "-55555") {
            if (hasValue(selectedAllergy.AllergyInfo))
                ShowErrorMessage("'" + selectedAllergy.AllergyInfo + "'" + " is not allowed to Edit. ");
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return false;
        }
        if (selectedAllergy.DrugID.toString() == "777777") {
            if (hasValue(selectedAllergy.AllergyInfo))
                ShowErrorMessage("'" + selectedAllergy.AllergyInfo + "'" + " is not allowed to Edit. ");
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return false;
        }


        if (selectedAllergy.DrugID.toString() == "888888") {

            $scope.allergiesMainviewGetPastHistoryEditFreeTextAllergies(selectedAllergy);
        }
        else {

            var dataToPopup = {
                PatientName: $scope.allergiesMainViewSelectedPatientInfo.PersonLastNameFirstName,
                AppointmentID: $scope.$parent.EMRDataFromPopup.AppointmentID,
                PatientID: $scope.allergiesMainViewSelectedPatientInfo.PatientID,
                selectedAllergyInfo: selectedAllergy
            };

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/194'*/GetEMRPageURLByIndex(194), dataToPopup, 'lmd').then(function (result) {
                $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
                $scope.allergiesMainViewGetPastHistoryAllergiesList();//refreshing the list
            });

        }



    };
    //################### EDIT ALLERGIES INFO   BLOCK END #########################



    //################### EDIT  ALLERGIES FREE TEXT INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the Edit free text popup for the allergies
    //*******CREATED BY:  HEMANTH U
    //*******CREATED DATE: 01/06/2015    
    $scope.allergiesMainviewGetPastHistoryEditFreeTextAllergies = function (selectedAllergy) {

        var dataToPopup = {
            PatientInfo: $scope.allergiesMainViewSelectedPatientInfo,
            selectedAllergyInfo: selectedAllergy
        };
        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/270'*/GetEMRPageURLByIndex(270), dataToPopup, 'md').then(function (result) {
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            $scope.allergiesMainViewGetPastHistoryAllergiesList();//refreshing the list
        });
    };

    //################### ADD  ALLERGIES FREE TEXT INFO   BLOCK END #########################


    //################### DELETE ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in deleting or removing the selected allergy from the allergies list from Past History Window
    //*******CREATED BY:  HEMANTH U
    //*******CREATED DATE: 08/29/2016
    //this method is useful in deleting or removing the selected allergy from the allergies list
    $scope.allergiesMainViewDirectiveDeleteClickEvent = function () {
        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-DELETEALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }
        var grid = $scope.allergiesMainViewDirectiveMainGridWidgets.grdAllergiesMainViewDirectiveMainGridInfo;
        if (!hasValue(grid)) return false;
        var selectedAllergy = grid.dataItem(grid.select());
        if (!hasValue(selectedAllergy)) {
            ShowErrorMessage('Please Select Allergy Information to Delete. ');
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            return false;
        }

        var dataToPopup = {
            //for surgical hx, object id is
            PastHxObjectID: 3,
            PatientID: $scope.allergiesMainViewSelectedPatientInfo.PatientID,
            selectedRow: selectedAllergy,
        };
        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/229'*/GetEMRPageURLByIndex(229), dataToPopup, 'sm').then(function (result) {
            $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
            $scope.allergiesMainViewGetPastHistoryAllergiesList();//refreshing the list
        });
    };
    //################### DELETE ALLERGIES INFO   BLOCK END #########################



    //################### CLOSE CURRENT WINDOW POPUP BLOCK START #############################
    ///*******PURPOSE:  This Method is used to close current popup
    //*******CREATED BY: Anusha Ch
    //*******CREATED DATE:08/25/2016
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesMainViewDirectiveCancel = function () {
        $("#divAllergiesMainViewDirectiveSearchAllergy_" + $scope.AllergiesMainViewDirectiveGUID).focus();
        $scope.$parent.CancelWithEvent();
    }
    //################### CLOSE CURRENT WINDOW POPUP BLOCK END #############################


    ////###################  MAXIMIZE POPUP BLOCK START #############################
    ////*******PURPOSE: THIS METHOD IS USED TO MAXIMIZE POPUP
    //*******CREATED BY: Anusha Ch
    //*******CREATED DATE:08/25/2016
    ////*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    $scope.allergiesMainViewDirectiveMaximize = function ($event) {
        $scope.$parent.Maximize($event);
    }
    ////###################  MAXIMIZE POPUP BLOCK END #############################



    //$scope.allergiesMainViewDirectivePageInIt();
}]);