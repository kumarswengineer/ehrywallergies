import { app } from "../../module";
import template from "./index.html";


app.component('allergies-delete', {
    template: template,
    controller: 'AllergiesDeleteController'
});
//*******PURPOSE: THIS Controller Is created for removing Allergies For the Patient
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 12/06/2014 
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.controller('AllergiesDeleteController', ['$scope', 'ModalPopupService', 'AllergiesService', function ($scope, ModalPopupService, AllergiesService) {

    this.$onInit = function () {
        $scope.allergiesDeletePageInit();
    }


    //ENUMERATIONS for sending the type of action
    var allergyRemoveType = {
        DELETEALLERGY: 1,
        RESOLVEALLERGY: 3,
        INACVTIVEALLERGYMAYOCCURINFUTURE: 2
    };
    Object.freeze(allergyRemoveType);//freezing the enumerations




    //page init method
    $scope.allergiesDeletePageInit = function () {
        $scope.deleteAllergiesWidget = {};//for grid maintainence
        $scope.deleteAllergyMoreOptions = "Brief View";
        $scope.allergiesDeletePatientID = $scope.EMRDataFromPopup.PatientID;
        $scope.allergiesDeleteDataFromParent = $scope.EMRDataFromPopup.selectedRow;
        $scope.allergiesDeleteGetCommonlyUsedRemoveReasons();
        $scope.deleteAllergyListDetailandBriefViewIconClick = true;
    };



    $scope.reasonsforAllergyDeleteGridOptionsDataSource = new kendo.data.DataSource({
        data: [],//assigning null on default       
    });
    $scope.reasonsforAllergyDeleteGridOptions = {
        dataSource: $scope.reasonsforAllergyDeleteGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        selectable: "multiple row",
        columns: [
        {
            field: "CommonRemoveReason",
            title: "Remove Reasons"
        },
       // { command: [{ name: "Delete", text: "", width: 60, template: "<div class='gridImageAlign' style='padding-top:7px;'><span class='crossmarkDelete' style='font-size:25px;cursor:pointer;' title='Delete' ng-click='deleteAllergiesCommonlyUsedReasons(this.dataItem);'></span></div>" }], width: 60, title: " X " },//custom command click events fire when clicked on button
        ]
    };


    //################### GET ALLERGIES COMMONLY USED REASON LIST BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the list of commonly used remove reasons
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in getting the list of commonly used remove reasons
    $scope.allergiesDeleteGetCommonlyUsedRemoveReasons = function () {
        var serviceData = {
            ObjectID: 3
        };
        AllergiesService.allergiesGetCommonlyRemoveReasonsForAllergyList(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;            
            $scope.reasonsforAllergyDeleteGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source
        });
    };
    //################### GET ALLERGIES COMMONLY USED REASON LIST BLOCK END #########################


    //on change event in the grid
    $scope.reasonsforAllergyDeleteGridOptions.change = function () {
        var grid = $scope.deleteAllergiesWidget.grdReasonsforAllergyDelete;
        $scope.alergiesRemoveReasonSelectedInGrid = grid.dataItem(grid.select());
        $scope.allergiesDeleteRemoveClick();
    };



    //###################   METHOD TO HIDE SELETED OPTIONS BLOCK START  #########################
    $scope.deleteAllergyListViewClick = function () {
        if ($scope.deleteAllergyListDetailandBriefViewIconClick == true) {
            $("#btndeleteAllergyListMoreOptions").removeClass("DetailIcon").addClass("BriefIcon");
            $scope.deleteAllergyMoreOptions = "Detail View";
            $("#divDeleteAllergyIcons").show();
            $("#divDeleteAllergyEnterReasonstoRemove").show();
            $("#divDeleteAllergyOk").show();
            $("#taDeleteAllergyDescription").focus();
            

            $scope.deleteAllergyListDetailandBriefViewIconClick = false;
        }

        else {
            $("#btndeleteAllergyListMoreOptions").removeClass("BriefIcon").addClass("DetailIcon");
            $scope.deleteAllergyMoreOptions = "Brief View";
            $("#divDeleteAllergyIcons").hide();
            $("#divDeleteAllergyEnterReasonstoRemove").hide();
            $("#divDeleteAllergyOk").hide();
            $scope.deleteAllergyListDetailandBriefViewIconClick = true;
        }

    };
    // ###################  METHOD TO HIDE SELETED OPTIONS BLOCK END #########################



    //################### REMOVE ALLERGIES WITH REASON BLOCK START #########################
    //*******PURPOSE: this method is useful in removing  the selected allergy with the entered reason
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in removing  the selected allergy with the entered reason
    $scope.allergiesDeleteRemoveClick = function () {

        if (!hasValue($scope.alergiesRemoveReasonManual) && !hasValue($scope.alergiesRemoveReasonSelectedInGrid)) {
            $scope.taRemoveReasonManualFocus = true;
            ShowErrorMessage('Please Enter Remove Reason');
            return false;
        }
        var serviceData = {
            PatientID: $scope.allergiesDeletePatientID,
            AllergyRemoveType: allergyRemoveType.DELETEALLERGY,
            AllergyDetailsID: $scope.allergiesDeleteDataFromParent.AllergyDetailsID
        };

        if (!hasValue($scope.alergiesRemoveReasonSelectedInGrid)) {
            serviceData.Comment = $scope.alergiesRemoveReasonManual;
        }
        else {
            serviceData.Comment = $scope.alergiesRemoveReasonSelectedInGrid.CommonRemoveReason;
        }

        AllergiesService.allergiesRemoveAllergyWithReason(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.OK();//closing the popup after sucessful deletion
        });
    };
    //################### REMOVE ALLERGIES WITH REASON BLOCK END #########################


    //###################ON SELECT EVENT IN THE KENDO CONTEXT MENU CLSOING AUTOMATICALLY BLOCK START #########################
    //*******PURPOSE: this method is useful for closing context menu automatically on selecting event
    //*******CREATED BY:  Priyanka G
    //*******CREATED DATE: 04/28/2015
    $scope.onDeleteAllergyMoreOptionsContextMenuSelect = function (kendoEvent) {
        try {
            $scope.allergiesDeleteMoreOptionsContextMenu.close(100, 100);//closing on selecting the item in context menu    
        } catch (e) {
            kendoEvent.sender.close(100, 100);
        }

    };
    //###################ON SELECT EVENT IN THE KENDO CONTEXT MENU CLSOING AUTOMATICALLY BLOCK END #########################





   // $("[data-toggle='tooltip']").tooltip();
    //$scope.allergiesDeletePageInit();
}]);
