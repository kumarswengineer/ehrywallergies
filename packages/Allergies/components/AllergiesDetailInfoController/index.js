
import { app } from "../../module";
import template from "./template.html";


//*******PURPOSE: THIS Controller Is created for detail view of allergies
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Lakshmi B
//*******CREATED DATE: 12/06/2014 
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
app.component('allergies-detail-info', {
    template: template,
    controller: 'AllergiesDetailInfoController'
})



app.controller('AllergiesDetailInfoController', ['$scope', 'ModalPopupService', 'AllergiesService', function ($scope, ModalPopupService, AllergiesService) {

    this.$onInit = function () {
        $scope.allergiesDetailPageInit();
    }

    $scope.allergiesDetailInfoWidgets = {};//for maintaining the grid
    //page init method
    $scope.allergiesDetailPageInit = function () {
        $scope.AllergiesDetailInfoBriefAndDetailViewTitle = "Detail View";
        $scope.AllergiesDetailInfoBriefAndDetailViewIconClick = true;//brief view
        $scope.allergiesDetailinfoAllergyStatus = 1;//setting on init
        $scope.allergiesDetailInfoGetAllergiesDetailsInfoList();
        setTimeout(function () {
            $scope.allergiesDetailInfoWidgets.ddlAllergiesStatusList.focus();
        }, 10);
    };

    //Allergies detail Info Grid Data Source
    //$scope.allergiesDetailInfo = [
    //              { "AllergyName": "Adalat", "Manifestations": "Head", "Severity": "Mild", "Intolerance": "No", "AdverseReaction": "No", "StartedOn": "", "InfoFrom": "", "AddedOn": "2/20/2015 10:26 AM", "AddedBy": "Joel Alexander MD", "Status": "Active" },
    //              { "AllergyName": "Chocolate", "Manifestations": "Latex", "Severity": "Moderate", "Intolerance": "No", "AdverseReaction": "No", "StartedOn": "", "InfoFrom": "", "AddedOn": "2/212015 8:06 AM", "AddedBy": "Joel Alexander MD", "Status": "Active" },
    //              { "AllergyName": "Creatures", "Manifestations": "Skin", "Severity": "Fatal", "Intolerance": "No", "AdverseReaction": "No", "StartedOn": "", "InfoFrom": "", "AddedOn": "2/212015 10:34 AM", "AddedBy": "Joel Alexander MD", "Status": "Active" },

    //];

    $scope.allergiesDetailInfoGridOptionsDataSource = new kendo.data.DataSource({
        data: [],//assigning null on default       
    });

    var allergiesDetailInfoAllergyNameColumnWidth = 200, allergiesDetailInfoManifestationsColumnWidth = 100, allergiesDetailInfoSeverityColumn = 100, allergiesDetailInfoInfoFromColumn = 100;

    if ($(window).width() >= 995) {
        allergiesDetailInfoAllergyNameColumnWidth = 304;
        allergiesDetailInfoManifestationsColumnWidth = 240;
        allergiesDetailInfoSeverityColumn = 160;
        allergiesDetailInfoInfoFromColumn = 135;
        //alert(">= 995");
    }
    else if ($(window).width() < 995 && $(window).width() >= 700) {
        allergiesDetailInfoAllergyNameColumnWidth = 144;
        allergiesDetailInfoManifestationsColumnWidth = 130;
        allergiesDetailInfoSeverityColumn = 130;
        allergiesDetailInfoInfoFromColumn = 135;
        //alert("< 995");
    }
    else if ($(window).width() < 700) {
        allergiesDetailInfoAllergyNameColumnWidth = 130;
        allergiesDetailInfoManifestationsColumnWidth = 120;
        allergiesDetailInfoSeverityColumn = 100;
        allergiesDetailInfoInfoFromColumn = 125;
        //alert("< 700");
    }

    //these are the options for the kendo grid
    $scope.allergiesDetailInfoGridOptions = {
        dataSource: $scope.allergiesDetailInfoGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        selectable: "single row",
        columns: [
        {
            field: "DrogName",
            title: "Allergy Name",
            width: allergiesDetailInfoAllergyNameColumnWidth,
        },
         {
             field: "MenifestationNames",
             title: "Manifestations",
             width: allergiesDetailInfoManifestationsColumnWidth,
         },
          {
              field: "SeverityName",
              title: "Severity",
              width: allergiesDetailInfoSeverityColumn,
          },
           //{
           //    field: "Intolerable",
           //    title: "Intolerance",
           //    width: 100,
           //},
           // {
           //     field: "AdverseReaction",
           //     title: "Adverse Reaction",
           //     width: 100
           // },
            {
                field: "Allergy_StartDate",
                title: "Started Date",
                attributes: { "class": "gridImageAlign" },
                //template: "#= kendo.toString(new Date(Allergy_StartDate), 'MM/dd/yyyy')# ",
                width: 135,
            },
             //{
             //    field: "InfoFrom",
             //    title: "Info From",
             //    width: 135,
             //    hidden: true,
             //},
              {
                  field: "AddedOn",
                  title: "Added Date",
                  attributes: { "class": "gridImageAlign" },
                  width: 165,
              },
             {
                 field: "AddedBy",
                 title: "Added by",
                 width: 200,
             },

              {
                  field: "RemovedOn",
                  title: "Removed Date",
                  attributes: { "class": "gridImageAlign" },
                  width: 165,
              },
              {
                  field: "RemovedBy",
                  title: "Removed By",
                  width: 200,
              },
              {
                  field: "RemovedReason",
                  title: "Removed Reason",
                  width: 120
              },
              {
                  field: "ModifiedBy",
                  title: "Modified By",
                  width: 200,
              },
              {
                  field: "ModifiedOn",
                  title: "Modified Date",
                  attributes: { "class": "gridImageAlign" },
                  width: 165,
              },
              {
                  field: "ModifiedReason",
                  title: "Modified Reason",
                  width: 200
              },
              //{
              //    field: "ModifiedDateISO",
              //    title: "Modified Date (ISO)",
              //    attributes: { "class": "gridImageAlign" },
              //    width: 190,
              //},
               {
                   field: "ResolvedBy",
                   title: "Resolved By",
                   width: 200,
               },
              {
                  field: "ResolvedOn",
                  title: "Resolved Date",
                  attributes: { "class": "gridImageAlign" },
                  width: 165,
              },
              {
                  field: "ResolvedReason",
                  title: "Resolved Reason",
                  width: 200
              },
                {
                    field: "Status",
                    title: "Status",
                    //locked : true,
                    width: 135,
                },
                {
                    field: "",
                    title: "",
                },

        ]
    };

    //on change event in the grid
    $scope.allergiesDetailInfoGridOptions.change = function (e) {
        var grid = $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo;
        $scope.allergiesDetailInfoSelectedItem = grid.dataItem(grid.select());

    };


    //on dataBound event in the grid
    $scope.allergiesDetailInfoGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        if (e.sender.dataSource.data().length > 0) {
            $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo = e.sender;
            $scope.allergiesDetailedInfoMakeColumnsVisible();
        }
        else {
            setTimeout(function () {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo = e.sender;
                $scope.allergiesDetailedInfoMakeColumnsVisible();

            }, 100);
        }
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 28002);
        }
    };


    //###################   METHOD TO HIDE SELETED OPTIONS BLOCK START  #########################
    $scope.allergiesDetailInfoBriefAndDetailView = function () {
        if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick == true) {
            $("#btnAllergiesDetailInfoBriefAndDetailView").removeClass("DetailIcon").addClass("BriefIcon");
            $scope.AllergiesDetailInfoBriefAndDetailViewTitle = "Brief View";
            $scope.AllergiesDetailInfoBriefAndDetailViewIconClick = false;
            $scope.allergiesDetailedInfoMakeColumnsVisible();
        }

        else {
            $("#btnAllergiesDetailInfoBriefAndDetailView").removeClass("BriefIcon").addClass("DetailIcon");
            $scope.AllergiesDetailInfoBriefAndDetailViewTitle = "Detail View";
            $scope.AllergiesDetailInfoBriefAndDetailViewIconClick = true;
            $scope.allergiesDetailedInfoMakeColumnsVisible();
        }

    };
    // ###################  METHOD TO HIDE SELETED OPTIONS BLOCK END #########################


    $scope.allergiesDetailInfoDDlDataSource = [{ status: " - Show All - ", statusValue: 4 },
                                               { status: "Active", statusValue: 1 }, { status: "Modified", statusValue: 2 },
                                               { status: "Deleted", statusValue: 3 }, { status: "Resolved", statusValue: 5 },
                                                { status: "In Active", statusValue: 6 }];


    ////these are the ddl options for the status
    //$scope.allergiesDetailedInfoStatusddlOptions = {
    //    dataBound: function (e) {
    //        $scope.allergiesDetailinfoAllergyStatus = 1;
    //        //e.sender.select(1);
    //        //var selectedItem = e.sender.dataItem(e.sender.select());
    //        //$scope.allergiesDetailinfoAllergyStatus = selectedItem.statusValue;
    //        //$scope.allergiesDetailInfoGetAllergiesDetailsInfoList(selectedItem.statusValue);
    //    },
    //    //change: function (e) {
    //    //    var selectedItem = e.sender.dataItem(e.sender.select());
    //    //    $scope.allergiesDetailinfoAllergyStatus = selectedItem.statusValue;
    //    //    $scope.allergiesDetailInfoGetAllergiesDetailsInfoList(selectedItem.statusValue);
    //    //},
    //};


    //###################  METHOD TO GET THE ALLERGIES DETAILED INFO BLOCK START  #########################
    /// *******PURPOSE: this method is useful in getting the current allerrgies list detailed info from the database
    ///*******CREATED BY: Mahesh P
    ///*******CREATED DATE: 02/27/2015
    //this method is useful in getting the current allerrgies list detailed info from the database
    $scope.allergiesDetailInfoGetAllergiesDetailsInfoList = function () {
        var patientInfo = $scope.EMRDataFromPopup.PatientInfo;
        var postData = {
            PatientID: patientInfo.PatientID,
            AllergyItemType: parseInt($scope.allergiesDetailinfoAllergyStatus),//1 -Active,2 -Modified,3 -InActive,4 -All,5 - Resolved Allergy, 6- InActiveAllergy_MayOccurInFuture
        };
        AllergiesService.allergiesGetPatientAllergiesDetailedInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesDetailInfoGridOptionsDataSource.data(serviceResponse);
        });
    };
    //###################  METHOD TO GET THE ALLERGIES DETAILED INFO BLOCK END  #########################

    //###################  METHOD TO MAKE THE COLUMNS VISIBLE BASED ON STATUS BLOCK START  #########################
    /// *******PURPOSE: this method is useful in making the columns visible based on the status 
    ///*******CREATED BY: Mahesh P
    ///*******CREATED DATE: 02/27/2015
    //this method is useful in making the columns visible based on the status 
    $scope.allergiesDetailedInfoMakeColumnsVisible = function () {
        $scope.allergiesDetailedInfoMakeAllColumnsHide();
        //active
        if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 1) {
            if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick) {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");
            }
            else {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Allergy_StartDate");
            }
        }
            //all
        else if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 4) {
            $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Status");
            if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick) {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedReason");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("InfoFrom");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");

            }
            else {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedReason");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("InfoFrom");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Allergy_StartDate");
            }
        }
            //modified
        else if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 2) {
            if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick) {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedDateISO");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedReason");

            }
            else {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ModifiedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ModifiedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ModifiedDateISO");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ModifiedReason");
            }
        }
            //deleted    //Inactive
        else if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 3 || parseInt($scope.allergiesDetailinfoAllergyStatus) == 6) {
            if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick) {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedReason");

            }
            else {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("RemovedReason");
            }
        }
            //Resolved
        else if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 5) {
            if ($scope.AllergiesDetailInfoBriefAndDetailViewIconClick) {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedReason");

            }
            else {
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AddedBy");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Intolerable");
                //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("AdverseReaction");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("Allergy_StartDate");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ResolvedBy");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ResolvedOn");
                $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("ResolvedReason");
            }
        }

        else {
            $scope.allergiesDetailedInfoMakeAllColumnsHide();
        }

    };
    //###################  METHOD TO MAKE THE COLUMNS VISIBLE BASED ON STATUS BLOCK END  #########################


    //###################  METHOD TO MAKE THE COLUMNS HIDE  BLOCK START  #########################
    /// *******PURPOSE: this method is useful in making the all columns hide 
    ///*******CREATED BY: Mahesh P
    ///*******CREATED DATE: 02/27/2015
    //this method is useful in making the all columns hide
    $scope.allergiesDetailedInfoMakeAllColumnsHide = function () {

        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Allergy_StartDate");
        //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Intolerable");
        //$scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AdverseReaction");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("Status");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedOn");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("AddedBy");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedOn");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedBy");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("RemovedReason");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedBy");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedOn");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedDateISO");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ModifiedReason");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedBy");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedOn");
        $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("ResolvedReason");

        //if (parseInt($scope.allergiesDetailinfoAllergyStatus) == 4) {
        //    $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.hideColumn("InfoFrom");
        //}
        //else {
        //    $scope.allergiesDetailInfoWidgets.grdAllergiesDetailInfo.showColumn("InfoFrom");
        //}
    };
    //###################  METHOD TO MAKE THE COLUMNS HIDE  BLOCK END  #########################

    //$scope.allergiesDetailPageInit();

}]);