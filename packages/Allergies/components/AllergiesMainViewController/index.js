
import { app } from "../../module";
import template from "./index.html";


app.component('allergies-main-view', {
    template: template,
    controller: 'AllergiesMainViewController'
})

//*******PURPOSE: THIS Controller Is created for Viewing the Alleargies Selected in the Grid View
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 12/05/2014 
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.controller('AllergiesMainViewController', ['$scope', 'ModalPopupService', 'AllergiesService', '$stateParams', 'EMRCommonFactory', function ($scope, ModalPopupService, AllergiesService, $stateParams, EMRCommonFactory) {


    this.$onInit = function () {
        $scope.allergiesMainViewPageInit();
    }

    //page init method
    $scope.allergiesMainViewPageInit = function () {

        $scope.allergiesWidget = {};//for grid maintainence      

        //if (hasValue($stateParams.patientChartInfo)) {
        //    $scope.allergiesMainViewPatientChartInfo = JSON.parse($stateParams.patientChartInfo);
        //    $scope.AllergiesPopupHeader = "Allergies for " + $scope.allergiesMainViewPatientChartInfo.PatientName;
        //}
        //else {
        $scope.allergiesMainViewPatientChartInfo = $scope.EMRDataFromPopup;
        $scope.AllergiesPopupHeader = "Allergies for " + $scope.allergiesMainViewPatientChartInfo.PatientName;
        //}
        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-VIEWALLERGIES") == EMRPermissionType.DENIED) {
            $scope.allergiesPopupShowAllergiesInformation = false;
            $scope.allergiesPopupEmrPermissionShowingMessage = EmrPermissionShowingMessage;
            return;
        }
        else {
            $scope.allergiesPopupShowAllergiesInformation = true;
        }

        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "FromMyForms")
            $scope.btnOKandAppendAllergiesShowHide = true;
        else
            $scope.btnOKandAppendAllergiesShowHide = false;

        if (hasValue($scope.allergiesMainViewPatientChartInfo)) {
            $scope.allergiesGetAllergiesList();
        }

        $scope.allergiesNoKnownAllergiesShow = false;

    };


    $scope.allergiesMainViewGridOptionsDataSource = new kendo.data.DataSource({
        data: [],//assigning null on default       
    });

    $scope.allergiesMainViewGridOptions = {
        dataSource: $scope.allergiesMainViewGridOptionsDataSource,
        sortable: true,
        selectable: "single row",
        columns: [
            {
                field: "AllergyInfo",
                title: "Allergies Information",
                template: "<div title='#:AllergyInfo#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#:AllergyInfo#</div>",
                encoded: true,

            },
            //{ command: [{ name: "Edit", text: "", width: 60, template: "<div class='gridImageAlign'><span class='brankic-edit' style='font-size:25px;text-align:center;cursor:pointer;' ng-click='allergiesMainViewEditAllergie(this.dataItem);'></span></div>" }], width: 60, title: " E " },//custom command click events fire when clicked on button       
            //{ command: [{ name: "Delete", text: "", width: 60, template: "<div class='gridImageAlign' style='padding-top:7px;'><span class='crossmarkDelete' style='font-size:25px;cursor:pointer;' ng-click='allergiesMainViewDeleteAllergie(this.dataItem);'></span></div>" }], width: 60, title: " X " },//custom command click events fire when clicked on button
        ]
    };

    //on change event in the grid
    $scope.allergiesMainViewGridOptions.change = function (e) {
        var grid = e.sender;
        $scope.allergiesInfoSelectedItem = grid.dataItem(grid.select());
    };


    //on dataBound eent in the grid
    $scope.allergiesMainViewGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        $scope.allergiesInfoSelectedItem = undefined;//AFTER REFRESHING THE LIST REFRESHING THE SELECTED ITEM ALSO
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 19304);
        }
    };


    //################### ADD ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the add new allergie for the selected patient
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in opening the add new allergie for the selected patient
    $scope.allergiesMainViewAddNew = function () {

        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-ADDALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }
        var dataToPopup = {
            AppointmentID: $scope.allergiesMainViewPatientChartInfo.AppointmentId,
            PatientID: $scope.allergiesMainViewPatientChartInfo.PatientID,
        };


        if (hasValue($scope.allergiesMainViewPatientChartInfo.PatientName))
            dataToPopup.PatientName = $scope.allergiesMainViewPatientChartInfo.PatientName;
        else
            dataToPopup.PatientName = $scope.allergiesMainViewPatientChartInfo.PatientName;

        if (hasValue($scope.allergiesMainViewGridOptions) && hasValue($scope.allergiesMainViewGridOptions.dataSource) && hasValue($scope.allergiesMainViewGridOptions.dataSource.data()) &&
            $scope.allergiesMainViewGridOptions.dataSource.data().length > 0) {
            dataToPopup.CurrentAllergiesCount = $scope.allergiesMainViewGridOptions.dataSource.data().length;
            //dataToPopup.CurrentAllergiesList = $scope.allergiesMainViewGridOptions.dataSource.data();
        }

        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/194'*/GetEMRPageURLByIndex(194), dataToPopup, 'modal-1100px').then(function (result) {
            $scope.allergiesGetAllergiesList();//after successful closing refresh the list
        });
    };
    //################### ADD ALLERGIES INFO   BLOCK END #########################


    //################### GET ALLERGIES INFO LIST  BLOCK START #########################
    //*******PURPOSE: this method is useful in geting the allergies list from the service
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in geting the allergies list from the service
    $scope.allergiesGetAllergiesList = function () {
        var serviceData = {
            PatientID: $scope.allergiesMainViewPatientChartInfo.PatientID,
        };

        AllergiesService.allergiesGetPatientAllergiesInfo(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesMainViewGridList = serviceResponse;

            $scope.allergiesMainViewGridOptions.dataSource.data(serviceResponse);//refreshing the data source

            if (hasValue(serviceResponse) && serviceResponse.length > 0) {
                $scope.allergiesNoKnownAllergiesShow = false;
            }
            else {
                $scope.allergiesNoKnownAllergiesShow = true;
            }

        });
    };
    //################### GET ALLERGIES INFO LIST  BLOCK END #########################


    //################### DELETE ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in deleting or removing the selected allergy from the allergies list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in deleting or removing the selected allergy from the allergies list
    $scope.allergiesMainViewDeleteAllergie = function (currentRow) {

        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-DELETEALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }

        if (!hasValue($scope.allergiesInfoSelectedItem)) {
            ShowErrorMessage('Please Select Allergies Info to Delete');
            return;
        }
        var dataToPopup = {
            PastHxObjectID: PASTHXENUMS.ALLERRGIES,
            PatientID: $scope.allergiesMainViewPatientChartInfo.PatientID,
            selectedRow: $scope.allergiesInfoSelectedItem
        };
        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/229'*/GetEMRPageURLByIndex(229), dataToPopup, 'sm').then(function (result) {
            $scope.allergiesGetAllergiesList();//refreshing the list
        });
    };
    //################### DELETE ALLERGIES INFO   BLOCK END #########################


    //################### EDIT ALLERGIES INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the edit allergy popup TO EDIT THE SELECTED ALLERGY
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in opening the edit allergy popup    
    $scope.allergiesMainViewEditAllergie = function () {

        if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-EDITALLERGIES") == EMRPermissionType.DENIED) {
            ShowErrorMessage(EmrPermissionShowingMessage);
            return;
        }
        if (!hasValue($scope.allergiesInfoSelectedItem)) {
            ShowErrorMessage('Please Select Allergies Info to Edit');
            return;
        }

        //NOT ALLOW TO EDIT THE ALLERGIC TO UNKNOWN DRUG.
        else if ($scope.allergiesInfoSelectedItem.DrugID.toString() == "-666666") {
            ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return;
        }
        //NOT ALLOW TO EDIT THE NO KNOWN ALLERGIES(NKDA)
        else if ($scope.allergiesInfoSelectedItem.DrugID.toString() == "999999") {
            ShowErrorMessage('Unable to Edit ' + $scope.allergiesInfoSelectedItem.AllergyInfo);
            return;
        }
        else if ($scope.allergiesInfoSelectedItem.DrugID.toString() == "-55555") {
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return;
        }
        else if ($scope.allergiesInfoSelectedItem.DrugID.toString() == "777777") {
            //ShowErrorMessage('Unable to Edit Allergic to Unknown Drug.');
            return;
        }
        else {
            //if free text open the window with free text 
            //if ($scope.pastHistoryAllergiesGridListSelectedItem)
            //    $scope.pastHistoryEditFreeTextAllergies();

            if ($scope.allergiesInfoSelectedItem.DrugID.toString() == "888888") {

                $scope.allergiesEditFreeTextAllergies();
            }
            else {

                var dataToPopup = {
                    PatientName: $scope.allergiesMainViewPatientChartInfo.PatientName,
                    AppointmentID: $scope.allergiesMainViewPatientChartInfo.AppointmentID,
                    PatientID: $scope.allergiesMainViewPatientChartInfo.PatientID,
                    selectedAllergyInfo: $scope.allergiesInfoSelectedItem
                };

                ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/194'*/GetEMRPageURLByIndex(194), dataToPopup, 'lmd').then(function (result) {
                    $scope.allergiesGetAllergiesList();//refreshing the list
                });

            }
        }


    };
    //################### EDIT ALLERGIES INFO   BLOCK END #########################


    //################### EDIT  ALLERGIES FREE TEXT INFO   BLOCK START #########################
    //*******PURPOSE: this method is useful in opening the Edit free text popup for the allergies
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 01/06/2015    
    $scope.allergiesEditFreeTextAllergies = function () {

        var dataToPopup = {
            PatientInfo: $scope.allergiesMainViewPatientChartInfo,
            selectedAllergyInfo: $scope.allergiesInfoSelectedItem
        };
        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/270'*/GetEMRPageURLByIndex(270), dataToPopup, 'sm').then(function (result) {
            //$scope.pastHistoryGetAllergiesList();//refreshing the list
            $scope.allergiesGetAllergiesList();//refreshing the list
        });
    };

    //################### ADD  ALLERGIES FREE TEXT INFO   BLOCK END #########################



    //this method is useful in OK
    $scope.allergiesOKClick = function () {
        var gridDataSource = $scope.allergiesMainViewGridOptions.dataSource.data();//rea

        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "FromMyForms") {
            var result = {
                ResultType: EMRPopupButtonReturnType.OKANDOVERWRITE,
                dataToStore: gridDataSource,
                valueToPopulate: gridDataSource
            };
            $scope.OK(result);
        }
        else
            $scope.OK(gridDataSource);//returning the data
    };

    //this method is useful in clearing the data in the field 
    $scope.allergiesClearDataClick = function () {

        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "FromMyForms") {
            var result = {
                ResultType: EMRPopupButtonReturnType.CLEAR,
                dataToStore: [],
                valueToPopulate: ""
            };
            $scope.OK(result);
        }
        else
            $scope.OK("clear");//returning the data
    };



    //################### APPEND ALLERGIES  BLOCK START #########################
    //*******PURPOSE: THIS METHOD IS USEFUL TO APPEND SELECTED ALLERGIES TO FILED
    //*******CREATED BY: DURAG PRASAD V
    //*******CREATED DATE: 01/06/2015 
    $scope.allergiesOKClickAndAppend = function () {
        var gridDataSource = $scope.allergiesMainViewGridOptions.dataSource.data();//rea

        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.PopupOpenFrom) && $scope.EMRDataFromPopup.PopupOpenFrom == "FromMyForms") {
            var result = {
                ResultType: EMRPopupButtonReturnType.OKANDAPPEND,
                dataToStore: gridDataSource,
                valueToPopulate: gridDataSource
            };
            $scope.OK(result);
        }
        else
            $scope.OK(gridDataSource);//returning the data
    };

    //################### APPEND ALLERGIES  BLOCK END #########################

    //############################NO KNOWN ALLERGIES BUTTON CLICK EVENT BLOCK START ###############################
    $scope.allergiesNoKnownAllergiesClick = function () {
        var allergiesmoreinfomodelList = [];
        var allergiesmoreinfomodel = {};

        allergiesmoreinfomodel.AllergyInfoID = 7;
        allergiesmoreinfomodel.AllergyInformation = "No known Allergies";
        allergiesmoreinfomodel.AllergyInfo = "";
        allergiesmoreinfomodelList.push(allergiesmoreinfomodel); //Assing model to list 

        if (!hasValue(allergiesmoreinfomodelList) || allergiesmoreinfomodelList.length <= 0) return;

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentID,
            allergiesmoreinfomodelList: allergiesmoreinfomodelList,
            AllergyNKDAandASKDStatusType: 2,//for no known            
        };

        postData.IsConfirmationRequired = false;

        //Save serivce call to save the no known allergies
        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false; //If error in service response then return
            $scope.allergiesGetAllergiesList();
        });

    };
    //############################NO KNOWN ALLERGIES BUTTON CLICK EVENT BLOCK END ###############################


    //################### ADD BUTTON NO KNOWN DRUG ALLERGIES BLOCK START #########################
    //*******PURPOSE: THIS METHOD IS USEFUL TO APPEND THENO KNOWN DRUG ALLERGIES IN THE INFORMATION WINDOW
    //*******CREATED BY: NAGA TEJA N
    //*******CREATED DATE: 07 MARCH 2019
    $scope.allergiesNoKnownDrugAllergiesClick = function (ConfirmationToChange) {
        var allergiesmoreinfomodelList = [];
        allergiesmoreinfomodelList = [{ AllergyInfo: "", AllergyInfoID: 4, AllergyInformation: "No known Drug Allergies" }]

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentID,
            allergiesmoreinfomodelList: allergiesmoreinfomodelList,
            AllergyNKDAandASKDStatusType: 2,//for no known            
        };

        var grid = $scope.allergiesWidget.allergiesMainViewGrid;
        if (hasValue(grid) && hasValue(grid._data) && grid._data.length == 1) {
            if (grid._data[0].DrugID == 999999) {
                postData.IsConfirmationRequired = false;  //THIS FLAF IS USED TO DIRECTLY CHANGED THE STAUS
            }
        }
        //THIS ConfirmationToChange IS USED COMES FROM AFTER CONFIRM THE USER TO CHANGE THE STATUS AS ALLERGIES TO NO KNOWN DRUG ALLERGIES
        if (hasValue(ConfirmationToChange) && ConfirmationToChange == true) {
            postData.IsConfirmationRequired = false;
        }

        //Save serivce call to save the no known allergies WHEN THE IsConfirmationRequired FALG RETURNS FALSE
        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false; //If error in service response then return
            if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                $scope.allergiesNoKnownAllergiesConfirmationsList = serviceResponse.confirmationModelList;

                var item = $scope.allergiesNoKnownAllergiesConfirmationsList[0];

                ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), item.ConformationMessage, 'md').then(function (result) {
                    //confirmationListIndex = confirmationListIndex + 1;
                    if (result == "NO") {
                        return;

                    } else if (result == "YES") {
                        if (item.ConfirmationType != 1) {
                            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/300'*/GetEMRPageURLByIndex(300), item, 'md').then(function (result) {
                                if (isError(result)) return false; //If error in service response then return
                                if (!hasValue(result)) {
                                    return;
                                } else {
                                    var ConfirmationToChange = true;
                                    $scope.allergiesNoKnownDrugAllergiesClick(ConfirmationToChange);
                                }
                            });
                        }
                    }
                });
            } else {
                $scope.allergiesGetAllergiesList();
            }
        });

    };
      //################### ADD BUTTON NO KNOWN DRUG ALLERGIES BLOCK END #########################

    //$("[data-toggle='tooltip']").tooltip();
    //$scope.allergiesMainViewPageInit();

}]);

