import { app } from "../../module";


import template from "./template.html";


//*******PURPOSE: This Controller Is created for Resolved Reason For Allergies
//*******EFFECTIVE FILES: 
//*******CREATED BY: Rama M
//*******CREATED DATE:08/24/2016
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

angular.module('EMR.Admin').directive('emrResolvedReasonForAllergiesPopup', function () {
    return ({
        restrict: 'AE',
        transclude: true,
        replace: true,
        template: template,
        // templateUrl: GetEMRPageURLByPageName("EMRWEB/Allergies/ResolvedReasonForAllergiesPopup.html"),
        controller: "ResolvedReasonForAllergiesPopupController",//controller to bind
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
}).controller('ResolvedReasonForAllergiesPopupController', ["$scope", '$timeout', 'ModalPopupService', 'PastHistoryService', 'AllergiesService', function ($scope, $timeout, ModalPopupService, PastHistoryService, AllergiesService) {


    this.$onInit = function () {
        $scope.resolvedReasonForAllergiesPopupPageInIt();
    }

    //################### PAGE INIT BLOCK START #########################
    //*******PURPOSE: This is used for page initializAtion
    //*******CREATED BY: Rama M
    //*******CREATED DATE:08/24/2016
    $scope.resolvedReasonForAllergiesPopupPageInIt = function () {
        //ASSIGNING GUID
        $scope.resolvedReasonForAllergiesPopupGUID = adminGetGUID();

        $scope.resolvedReasonForAllergiesPopupWidgets = {};
        $scope.resolvedReasonForAllergiesPopupStatus = 0;
        if (hasValue($scope.$parent.EMRDataFromPopup)) {
            $scope.SelectedPastHxObjectID = $scope.$parent.EMRDataFromPopup.PastHxObjectID;
            $scope.SelectedPatientID = $scope.$parent.EMRDataFromPopup.PatientID;
            $scope.SelectedListItem = $scope.$parent.EMRDataFromPopup.selectedRow;
        }
        ////FLAG TO KNOW DETAIL VIEW OR BRIEF VIEW
        $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClickEvent = true;
        ////SHOWING TITLE
        $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconTitle = "Detail View";

        $scope.resolvedReasonForAllergiesPopupEnterReasonShow = false;
        $scope.resolvedReasonForAllergiesPopupGridShow = false;
        $scope.resolvedReasonForAllergiesPopupDetailIconShow = false;
        $scope.resolvedReasonForAllergiesPopupIconsShow = false;
        $scope.resolvedReasonForAllergiesPopupOkShow = false;

        $timeout(function () {
            if (!adminIsDevice()) {
                $scope.resolvedReasonForAllergiesPopupWidgets.ddlResolvedReasonForAllergiesPopupInfo.focus();
            }
        }, 100);

        $scope.pastHistoryRemoveReasonsCommonlyUsedReasonsList();
    };
    //################### PAGE INIT BLOCK END #########################

    //######### DATA FOR STATUS DROPDOWN BLOCK START #############
    ///*******PURPOSE: THIS IS USED TO PROVIDE  DATA FOR STATUS DROPDOWN IN SUPER BILL MANAGEMENT
    ///*******CREATED BY: Rama M
    ///*******CREATED DATE:02/06/2016
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.resolvedReasonForAllergiesPopupStatusDropdownInfo = [
      { "ResolvedReasonForAllergiesPopupStatusOption": "Active", "ResolvedReasonForAllergiesPopupStatusOptionId": "0" },
      { "ResolvedReasonForAllergiesPopupStatusOption": "Inactive", "ResolvedReasonForAllergiesPopupStatusOptionId": "2" },
      { "ResolvedReasonForAllergiesPopupStatusOption": "Resolved", "ResolvedReasonForAllergiesPopupStatusOptionId": "3" },
    ]

    //BIND THE DATA TO THE DROPDOWN DATASOURCE
    $scope.resolvedReasonForAllergiesPopupStatusDropdownDataSource = new kendo.data.DataSource({
        data: $scope.resolvedReasonForAllergiesPopupStatusDropdownInfo,//ASSIGNING NULL ON DEFAULT       
    });
    //######### DATA FOR STATUS ON DROPDOWN BLOCK END #############

    //###################   DETAIL AND BRIEF VIEW BLOCK START #########################
    //*******PURPOSE: this method is useful for detail and brief view.
    //*******CREATED BY: Rama M
    //*******CREATED DATE:08/25/2016
    $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClick = function () {
        if ($scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClickEvent == true) {
            $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconTitle = "Brief View";
            $("#btnResolvedReasonForAllergiesPopupMoreOptions_" + $scope.resolvedReasonForAllergiesPopupGUID).removeClass("DetailIcon").addClass("BriefIcon");
            $scope.resolvedReasonForAllergiesPopupIconsShow = true;
            $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClickEvent = false;
            $timeout(function () {
                //MAKING FOCUS ON ADD ICON
                $("#spanResolvedReasonForAllergiesPopupAdd_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
            });


        }
        else {
            $scope.resolvedReasonForAllergiesPopupIconsShow = false;

            $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconTitle = "Detail View";
            $("#btnResolvedReasonForAllergiesPopupMoreOptions_" + $scope.resolvedReasonForAllergiesPopupGUID).removeClass("BriefIcon").addClass("DetailIcon");
            $scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClickEvent = true;

        }
    }
    //###################   DETAIL AND BRIEF VIEW BLOCK END #########################


    //###################  STATUS DROPDOWN OPTION CHNAGE BLOCK START #########################
    //*******PURPOSE: this method is useful for changing the status dropdown
    //*******CREATED BY: Rama M
    //*******CREATED DATE:08/25/2016
    $scope.resolvedReasonForAllergiesPopupStatusOptionChange = function () {
        if ($scope.resolvedReasonForAllergiesPopupStatus == 0) {
            $scope.resolvedReasonForAllergiesPopupEnterReasonShow = false;
            $scope.resolvedReasonForAllergiesPopupGridShow = false;
            $scope.resolvedReasonForAllergiesPopupDetailIconShow = false;
            $scope.resolvedReasonForAllergiesPopupIconsShow = false;
            $scope.resolvedReasonForAllergiesPopupOkShow = false;

        }
        else if ($scope.resolvedReasonForAllergiesPopupStatus == 2) {
            $scope.resolvedReasonForAllergiesPopupEnterReasonShow = true;
            $scope.resolvedReasonForAllergiesPopupGridShow = true;
            $scope.resolvedReasonForAllergiesPopupDetailIconShow = true;
            $scope.resolvedReasonForAllergiesPopupOkShow = true;

            $timeout(function () {
                if (!adminIsDevice()) {
                    $("#txtResolvedReasonForAllergiesPopupEnterReason_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
                }
            }, 100);
            if ($scope.resolvedReasonForAllergiesPopupDetailViewBriefViewIconClickEvent == false) {
                $scope.resolvedReasonForAllergiesPopupIconsShow = true;
            }

        }
        else {
            $scope.resolvedReasonForAllergiesPopupEnterReasonShow = true;
            $scope.resolvedReasonForAllergiesPopupDetailIconShow = false;
            $scope.resolvedReasonForAllergiesPopupGridShow = false;
            $scope.resolvedReasonForAllergiesPopupIconsShow = false;
            $scope.resolvedReasonForAllergiesPopupOkShow = true;
            $timeout(function () {
                if (!adminIsDevice()) {
                    $("#txtResolvedReasonForAllergiesPopupEnterReason_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
                }
            }, 100);

        }
    }
    //###################  STATUS DROPDOWN OPTION CHNAGE BLOCK END #########################


    //###################      METHOD TO GET PAST HX REMOVE REASONS BLOCK START  #########################
    /// *******PURPOSE:THIS METHOD IS USED TO GET PROBLEM LIST REMOVE REASONS 
    ///*******CREATED BY: Lakshmi B
    ///*******CREATED DATE: 01/19/2015
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************     
    $scope.pastHistoryRemoveReasonsCommonlyUsedReasonsList = function () {
        var serviceData = {
            PastHxObjectID: 3,
        };
        PastHistoryService.pastHistoryGetPastHistoryCommonlyUsedRemoveReasons(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            //IF REASONS ARE NOT EXISTS THEN OPEN THE DETAIL VIEW FOR DELETE REASONS POPUP 
            //ADDED BY HEMANTH 
            //if ((!hasValue(serviceResponse) || serviceResponse.length == 0) && $scope.pastHistoryRemoveReasonsisFromLoad == true) {
            //    $scope.deleteMedicalHistoryViewClick();
            //}
            $scope.resolvedReasonForAllergiesPopupGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source
        });
    };
    //################### METHOD TO GET PAST HX REMOVE REASONS BLOCK END #########################



    $scope.resolvedReasonForAllergiesPopupGridInfo = [
    { "ReasonForAllergies": "Test" }
    ]



    //Data Source
    $scope.resolvedReasonForAllergiesPopupGridDataSource = new kendo.data.DataSource({
        data: [],// $scope.selectFormtoCopy,

    });


    //*******KENDO GRID BINDING BLOCK START*******
    //*******CREATED BY: Rama M
    //*******CREATED DATE: 08/25/2016
    //*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    $scope.resolvedReasonForAllergiesPopupGridOptions = {
        dataSource: $scope.resolvedReasonForAllergiesPopupGridDataSource,//assigning the data source
        sortable: true,
        navigatable: true,
        selectable: "multiple row",
        columns: [

            {
                field: 'PastHistoryReasonToRemove',
                title: 'Reason For Allergies',
                //width:344,
            },

        ],
    };

    $scope.resolvedReasonForAllergiesPopupGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 158906);
        }
        $scope.pastHistoryRemoveReasonSelectedInGrid = undefined;
    };

    //on change event in the grid
    $scope.resolvedReasonForAllergiesPopupGridOptions.change = function (e) {
        var grid = e.sender;
        $scope.pastHistoryRemoveReasonSelectedInGrid = grid.dataItem(grid.select());
    };
    //*******KENDO GRID BINDING BLOCK END*******



    $scope.resolvedReasonForAllergiesPopupAddClick = function () {
        var dataToPopup = {
            PastHxObjectID: $scope.SelectedPastHxObjectID,
            POPUPMODE: 1//FOR ADD NEW
        };

        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/290'*/GetEMRPageURLByIndex(290), dataToPopup, 'md').then(function (result) {
            if (!adminIsDevice())
                $("#spanResolvedReasonForAllergiesPopupAdd_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
            $scope.pastHistoryRemoveReasonsCommonlyUsedReasonsList();
        });
    };


    //this method is useful in edit the selected commonly removed reasons for the selected past HX Object
    $scope.resolvedReasonForAllergiesPopupEditClick = function () {
        if (!hasValue($scope.pastHistoryRemoveReasonSelectedInGrid)) {
            ShowErrorMessage('Please Select Remove Reason to Edit. ');
            return;
        }

        var dataToPopup = {
            selectedReason: $scope.pastHistoryRemoveReasonSelectedInGrid,
            PastHxObjectID: 3,
            POPUPMODE: 2//FOR EDIT MODE

        };

        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/290'*/GetEMRPageURLByIndex(290), dataToPopup, 'md').then(function (result) {
            if (!adminIsDevice())
                $("#spanResolvedReasonForAllergiesPopupEdit_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
            $scope.pastHistoryRemoveReasonsCommonlyUsedReasonsList();

        });
    };


    //this method is useful in deleting the selected commonly removed reasons for the selected past HX Object
    $scope.resolvedReasonForAllergiesPopupDeleteClick = function () {

        if (!hasValue($scope.pastHistoryRemoveReasonSelectedInGrid)) {
            ShowErrorMessage('Please Select Remove Reason to Delete. ');
            return;
        }

        var dataToService = {
            PastHxObjectID: $scope.pastHxObjectId,
            PastHxCmnRemoveReasonID: $scope.pastHistoryRemoveReasonSelectedInGrid.PastHistoryReasonToRemoveID
        };
        PastHistoryService.PastHistoryDeleteCommonRemoveReasonsBasedOnObjectID(dataToService).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            if (!adminIsDevice()) {
                $("#spanResolvedReasonForAllergiesPopupDelete_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();

            }
            $scope.pastHistoryRemoveReasonsCommonlyUsedReasonsList();
        });
    };


    $scope.resolvedReasonForAllergiesPopupOk = function () {
        //if ($scope.resolvedReasonForAllergiesPopupStatus != 0) {
        //if (!hasValue($scope.resolvedReasonForAllergiesPopupEnterReason) && !hasValue($scope.pastHistoryRemoveReasonSelectedInGrid)) {
        //    ShowErrorMessage('Please Select / Enter Reason to Inactive / Resolved.');
        //    if (!adminIsDevice()) {
        //        $("#txtResolvedReasonForAllergiesPopupEnterReason_" + $scope.resolvedReasonForAllergiesPopupGUID).focus();
        //    }
        //        //$scope.deleteSurgicalHistoryEnterReasonsFocus = true;
        //    //$("#taManualReason").focus();
        //    return false;
        //}

        var allegiesSelectedRow = $scope.SelectedListItem;

        if (!hasValue(allegiesSelectedRow)) return false;

        var serviceData = {
            PatientID: $scope.SelectedPatientID,
            AllergyRemoveType: $scope.resolvedReasonForAllergiesPopupStatus,//for delete
            AllergyDetailsID: allegiesSelectedRow.AllergyDetailsID
        };

        if (!hasValue($scope.pastHistoryRemoveReasonSelectedInGrid)) {
            serviceData.Comment = $scope.resolvedReasonForAllergiesPopupEnterReason;
        }
        else {
            serviceData.Comment = $scope.pastHistoryRemoveReasonSelectedInGrid.PastHistoryReasonToRemove;
        }

        AllergiesService.allergiesRemoveAllergyWithReason(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.$parent.OK();//closing the popup after sucessful deletion
        });
        //}
        //else {
        //    $scope.$parent.OK();//closing the popup after sucessful deletion
        //}
    }


    //################### CLOSE CURRENT WINDOW POPUP BLOCK START #############################
    ///*******PURPOSE:  This Method is used to close current popup
    ///*******CREATED BY: Rama M
    ///*******CREATED DATE:08/24/2016
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.resolvedReasonForAllergiesPopupCancel = function () {
        $scope.$parent.CancelWithEvent();
    }
    //################### CLOSE CURRENT WINDOW POPUP BLOCK END #############################

    ////###################  MAXIMIZE POPUP BLOCK START #############################
    ////*******PURPOSE: THIS METHOD IS USED TO MAXIMIZE POPUP
    ////*******CREATED BY:Rama M
    //*******CREATED DATE:08/24/2016
    ////*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    $scope.resolvedReasonForAllergiesPopupMaximize = function ($event) {
        $scope.$parent.Maximize($event);
    }
    ////###################  MAXIMIZE POPUP BLOCK END #############################



    //###################    PAGE INIT BLOCK STARTS #########################
    //page init ends here
    //$scope.resolvedReasonForAllergiesPopupPageInIt();

    //###################    PAGE INIT BLOCK END #########################
}]);

