import { app } from "../../module";
import template from "./index.html";

//*******PURPOSE: The purpose of the controller is used to set the reason for modifying the allergies info
//*******EFFECTIVE FILES: Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 03/02/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


app.component('allergies-reason-for-modifying-allergy-info', {
    template: template,
    controller: 'AllergiesReasonForModifyingAllerrgyInfoController'
})


app.controller('AllergiesReasonForModifyingAllerrgyInfoController', ["$scope", 'ModalPopupService', function ($scope, ModalPopupService) {

    this.$onInit = function () {
        $scope.allergiesReasonForModifyingAllerrgyInfoPageInit();
    }

    //page init method
    $scope.allergiesReasonForModifyingAllerrgyInfoPageInit = function () {
        $scope.allergiesReasonForModifyingAllerrgyInfoData = $scope.EMRDataFromPoopup;
        $scope.allergiesReasonForModifyingAllerrgyDetialView = false;
        $scope.reasonsForModifyingAllergyMoreOptions = "Detail View";
    };


    $scope.dataSourceForGrid = [
                  { AllergyInfo: "Patient Said he is not allergic today ", AllergyInfoID: 4 },
                  { AllergyInfo: "Patient family said he is not allergic to this medicine", AllergyInfoID: 2 },
                  { AllergyInfo: "Previous data entry erroneous", AllergyInfoID: 2 },
    ];


    $scope.allergiesReasonForModifyingAllerrgyInfoDataSource = new kendo.data.DataSource({
        data: $scope.dataSourceForGrid,//setting on default
    });

    $scope.reasonForModifyAllergiesGridOptions = {
        dataSource: $scope.allergiesReasonForModifyingAllerrgyInfoDataSource,
        navigatable: true,
        sortable: true,
        selectable: "single row",
        columns: [
            {
                field: "AllergyInfo",
                title: "Allergy Info",
            }
        ],
        change: function (es) {
            var grid = es.sender;
            $scope.selectedItemInGrid = grid.dataItem(grid.select());
            if(!$scope.allergiesReasonForModifyingAllerrgyDetialView)
                                $scope.reasonForModifyingAllergyOK();
        }
    };


    //this method is useful in setting the detail view and brief view in window
    $scope.reasonsForModifyingAllergyViewClick = function () {

        if ($scope.allergiesReasonForModifyingAllerrgyDetialView==false) {
            
            $("#btnReasonsForModifyingAllergyMoreOptions").removeClass("DetailIcon").addClass("BriefIcon");
            $scope.reasonsForModifyingAllergyMoreOptions = "Brief View";
            if (!adminIsDevice()) {
                $scope.reasonForModifyingAlleriesFreeTextFocus = true;
            }
            $scope.allergiesReasonForModifyingAllerrgyDetialView = true;

        }
        else {
            
            $scope.reasonForModifyingAlleriesFreeTextFocus = true;//set the focus
            $("#btnReasonsForModifyingAllergyMoreOptions").removeClass("BriefIcon").addClass("DetailIcon");
            $scope.reasonsForModifyingAllergyMoreOptions = "Detail View";
            $scope.allergiesReasonForModifyingAllerrgyDetialView = false;

        }
    };

    


    //################### METHOD TO SAVE THE REASON FOR MODIFYING ALLERGYINFO  BLOCK START  #########################
    /// *******PURPOSE: this method is useful in saving the 9modiufying reason for the selected allergen information
    ///*******CREATED BY: Mahesh P
    ///*******CREATED DATE: 02/12/2015    
    $scope.reasonForModifyingAllergyOK = function () {

        if (!hasValue($scope.selectedItemInGrid) && !hasValue($scope.reasonForModifyingAlleriesFreeText)) {
            ShowErrorMessage("Please Select / Enter Modifying Reasons.");
            $scope.reasonForModifyingAlleriesFreeTextFocus = true;
            return;
        }
        var returnMessage;

        if (hasValue($scope.selectedItemInGrid))
            returnMessage = $scope.selectedItemInGrid.AllergyInfo;
        else if (hasValue($scope.reasonForModifyingAlleriesFreeText))
            returnMessage = $scope.reasonForModifyingAlleriesFreeText;

        $scope.OK(returnMessage);//RETURNING THE SELECTED DATA TO POPUP
    };
    //################### METHOD TO SAVE THE REASON FOR MODIFYING ALLERGYINFO  BLOCK START  #########################


    $scope.$on("destroy", function () {

        $("#frmReasonForModifyingAllerrgyInfo").find("*").off();

    });


    //$scope.allergiesReasonForModifyingAllerrgyInfoPageInit();
}]);