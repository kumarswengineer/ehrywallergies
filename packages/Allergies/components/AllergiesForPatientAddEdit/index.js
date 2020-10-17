import { app } from "../../module";
import template from "./index.html";


//*******PURPOSE: THIS Controller Is created for Adding or Editing the Allergies For the Patient
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 12/05/2014 
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.component('allergies-add-edit', {
    template: template,
    controller: 'AllergiesAddEditController'
})


app.controller('AllergiesAddEditController', ['$scope', 'ModalPopupService', 'AllergiesService', '$timeout', 'EMRCommonFactory', function ($scope, ModalPopupService, AllergiesService, $timeout, EMRCommonFactory) {

    this.$onInit = function () {
        $scope.allergiesAddEditPageInit();
    }

    $scope.allergiesAddEditWidgets = {};//for grid maintainence
    //page init method
    $scope.allergiesAddEditPageInit = function () {
        // $scope.allergiesAddEditDrugsGridDataList = [];//on init assigning empty
        $scope.allergiesAddEditWidgets = {};//for grid maintainence
        $scope.allergiesAddEditGUID = adminGetGUID();//Assigning GUID
        $scope.allergySavingModel = {};        //on init 
        $scope.allergiesEditMode = false;
        $scope.allergiesAddEditGetSeverityList();
        $scope.allergiesAddEditGetOrgansList();
        $scope.allergiesShowVaccinesGrid = false;
        $scope.allergiesForPatientAddEditSearchWidthClass = "colReq-sm-6 col-xs-4";
        $scope.allergiesForPatientAddEditOrganTypeClass = "colReq-sm-4 col-xs-4";
        $scope.allergiesAddEditDropDownWidthClass = "col-md-2 colReq-sm-2 col-xs-4";
        $scope.allergiesAddEditSearchSnomedWidthClass = "colReq-sm-4 col-xs-4";
        //$scope.allergiesAddEditSearchShowInDetailView = false;
        $scope.allergiesAddEditSearchShowInDetailViewTextBox = false;
        //This flag is used to perform search operation by default it is false
        $scope.isFromEditManifestationSearch = false;

        ////FLAG TO KNOW DETAIL VIEW OR BRIEF VIEW
        $scope.allergiesAddEditBriefAndDetailIconClickEvent = true;

        ////SHOWING TITLE
        $scope.allergiesAddEditDetailBriefTitle = "Detail View";
        $scope.allergiesAddEditDetailNameTitle = "No Known Drug Allergy";


        $scope.allergiesAddEditSaveAllergiesInformationClick = false;
        $scope.allergisforPatientCancelButtonText = "Cancel";

        $scope.allergiesAddEditSaveandAddMoreAdverseReactionbtnText = "Adverse Reaction +";
        $scope.allergiesAddEditSaveandAddMoreIntolerancebtnText = "Intolerance +";
        $scope.allergiesAddEditSaveandAddMoreAllergicbtnText = "Allergic +";

        /// $scope.allergisforPatientShowHideClose = true;//show close btn by default
        $scope.allergiesAddEditpageAsverseReactionShowHide1 = true;
        $scope.allergiesForPatientAddEditNoKnownAllergiesShow = true;
        $scope.allergiesForPatientAddEditRightSideButtonsClass = "col-md-6 col-xs-6";
        //if the popup is openend in edit mode then it has selected allergy info
        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {

            if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-EDITALLERGIES") == EMRPermissionType.DENIED) {
                // ShowErrorMessage(EmrPermissionShowingMessage);
                $scope.allergiesforpatientAddEditEmrPermissionShowingMessage = EmrPermissionShowingMessage;
                $scope.allergiesforpatientAddEditPermissionavailable = false;
                return;
            }
            else {
                $scope.allergiesforpatientAddEditPermissionavailable = true;
            }

            //IN ADD MODE NO NEED TO DISPLY + AT THE END 
            $scope.allergiesAddEditSaveandAddMoreAdverseReactionbtnText = "Adverse Reaction";
            $scope.allergiesAddEditSaveandAddMoreIntolerancebtnText = "Intolerance";
            $scope.allergiesAddEditSaveandAddMoreAllergicbtnText = "Allergic";

            //  $scope.allergisforPatientShowHideClose = false;//hide the close btn in edit mode
            $scope.allergiesAddEditpageAsverseReactionShowHide1 = false;
            $scope.allergiesForPatientAddEditRightSideButtonsClass = "col-md-12 col-xs-12";
            $scope.allergiesAddEditDetailShow = false;
            $scope.allergiesAddEditPageTitle = "Edit Allergies Info for " + $scope.EMRDataFromPopup.PatientName;
            $scope.allergiesForPatientAddEditNoKnownAllergiesShow = false;
            $scope.allergiesEditMode = true;
            $scope.txtSearcManifestation = true;
            $scope.allergiesAddEditSearchManifestationShowHide = true;
            //these jQuery Lines are useful in resizing the div size 
            //the following lines are used for the drugs div since we are displaying the only manifestations for the user in edit mode only
            $("#divDrug").removeClass('col-md-6');
            $("#divManifestations").removeClass('colReq-sm-6');
            $("#divManifestations").addClass('col-md-12');
            //the following jQuery line is useful in removing the class and adding the class for the severity type ddl 
            //it is visible in only edit mode where as it is used to visible in mobile in add mode
            $("#divSeverityTypeInEditMode").removeClass('form-group visibleAtMobile');
            $("#divSeverityTypeInEditMode").addClass('form-group');

            $scope.allergiesEditModeInfo = $scope.EMRDataFromPopup.selectedAllergyInfo;//selected allergy info from the parent

            $scope.allergySavingModel.AllergyDetailsID = $scope.allergiesEditModeInfo.AllergyDetailsID;

            $scope.allergySavingModel.Allergen_IDs = $scope.allergiesEditModeInfo.DrugID;

            $scope.allergySavingModel.Allergen_TypeID = $scope.allergiesEditModeInfo.Allergen_TypeID;

            //$scope.allergySavingModel.SourceOfHXID = $scope.allergiesEditModeInfo.SourceHX;

            //$scope.allergiesAddEditAllergiesDrugType = $scope.allergiesEditModeInfo.Allergen_TypeID;



            $scope.previousAllergyType = $scope.allergiesEditModeInfo.TypeOfAddedAllergyID;//1-Allergic, 5- Not Allergic

            if (hasValue($scope.allergiesEditModeInfo.DrogName)) {
                $scope.allergiesEditModeSelectedDrug = $scope.allergiesEditModeInfo.DrogName;
            }

            $scope.allergiesEditModeManifestationSearchString = "";//ON INIT GETTING THE ALL
            $scope.allergiesAddEditGetManifestationList($scope.allergiesEditModeManifestationSearchString);
            if ($scope.allergiesEditMode) {
                $scope.allergiesAddEditAllergiesOrganType = "-1"//only in edit mode setting the all categories
            }
            $scope.allergiesAddEditManifestationListHideShow = true;
            $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = false;   //To hide the NO Known allergies button
            $scope.allergiesAddEditSearchShowInDetailView = false;
            $scope.allergiesForPatientAddEditNoKnownAllergiesShow = false;
        }
        else {

            if (EMRCommonFactory.EMRCheckPermissions("ALLERGIES-ADDALLERGIES") == EMRPermissionType.DENIED) {
                $scope.allergiesforpatientAddEditEmrPermissionShowingMessage = EmrPermissionShowingMessage;
                $scope.allergiesforpatientAddEditPermissionavailable = false;
                return;
            }
            else {
                $scope.allergiesforpatientAddEditPermissionavailable = true;
            }

            //add mode
            $scope.allergiesAddEditDetailShow = true;
            $scope.allergiesAddEditPageTitle = "Add Allergies Info for " + $scope.EMRDataFromPopup.PatientName;
            $scope.allergySavingModel.Allergen_TypeID = 4;//by default we load the drug so as to this initializing it..
            $scope.allergiesAddEditGetAllergenTypeList();//getting the allergen types list
            //$scope.allergiesAddEditGetCommonlyUsedDrugsList();//on init loading the common drugs list
            //$scope.allergiesAddEditGetAllDrugsList();         //on init loading the drugs list
            $scope.allergiesAddEditGetAllergiesListLinkedtoPatient();
            //$scope.IsFromDrugAllergenType = true;
            if (hasValue($scope.EMRDataFromPopup.CurrentAllergiesCount) && $scope.EMRDataFromPopup.CurrentAllergiesCount > 0) {
                $scope.IsFromDrugAllergenType = true;
            }
            else {
                $scope.IsFromDrugAllergenType = false;
            }
            $scope.txtSearchDrugFocus = true;
            $scope.pastHxAllergiesSearchDrugFocus = true;//TO MAINTAIN THE CURSOR POSITION WHILE LOADING THE FORM

            $scope.allergiesAddEditpageNoKnownAllergiestext = "NKDA"; //On default button name 
            $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = false;  //To Show the NO Known allergies button
            $scope.allergiesAddEditManifestationListHideShow = false;
            $scope.allergiesAddEditSearchManifestationShowHide = false;

            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.CurrentAllergiesCount) && $scope.EMRDataFromPopup.CurrentAllergiesCount > 0) {
                $scope.allergiesAddEditSearchShowInDetailView = false;
                $scope.allergiesForPatientAddEditNoKnownAllergiesShow = true;
            }
            else {
                $scope.allergiesAddEditSearchShowInDetailView = true;
                $scope.allergiesForPatientAddEditNoKnownAllergiesShow = false;
            }

            $scope.allergiesNKDAButtonShowStatus = false;
            $scope.allergiesNKFAButtonShowStatus = false;
            $scope.allergiesNKEAButtonShowStatus = false;
            $scope.allergiesNKOAButtonShowStatus = false;

            //if (hasValue($scope.EMRDataFromPopup.CurrentAllergiesList) && $scope.EMRDataFromPopup.CurrentAllergiesList.length > 0) {
            //    //var AllergiesRelatedToNoKnownStatus = $.grep($scope.EMRDataFromPopup.CurrentAllergiesList, function (element, index) {
            //    //    return element.DrugID == "999999" && (element.Allergen_TypeName == "NKDA" || element.Allergen_TypeName == "NKFA" || element.Allergen_TypeName == "NKEA" || element.Allergen_TypeName == "NKOA"); // retain appropriate elements
            //    //});

            //    //if (hasValue(AllergiesRelatedToNoKnownStatus) && AllergiesRelatedToNoKnownStatus.length > 0) {
            //    angular.forEach($scope.EMRDataFromPopup.CurrentAllergiesList, function (item, index) {
            //        if (item.DrugID == "999999" && item.Allergen_TypeName == "NKDA")
            //            $scope.allergiesNKDAButtonShowStatus = false;
            //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKFA")
            //            $scope.allergiesNKFAButtonShowStatus = false;
            //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKEA")
            //            $scope.allergiesNKEAButtonShowStatus = false;
            //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKOA")
            //            $scope.allergiesNKOAButtonShowStatus = false;
            //    });

            //    //}

            //    $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = $scope.allergiesNKDAButtonShowStatus;

            //}
        }
        $scope.allergiesAddEditDrugsGridHeightClass = "allergiesDrugsGrid gridWith5rows_sm";
        $scope.allergiesAddEditDropdown = 0;
        if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEasyForms) && $scope.EMRDataFromPopup.isFromEasyForms == true) {
            $scope.allergiesAddEditClearDataShowHide = false;
        }
        else {
            $scope.allergiesAddEditClearDataShowHide = false;
        }

        $("#txtAllergiesDrugSearch_" + $scope.allergiesAddEditGUID).focus();

    };

    var noKnownAllergiesInformation = {
        noKnownFoodAllergies: 2,
        noKnownDrugAllergies: 4,
        noKnownEnvironmentalAllergies: 3,
        noKnownVaccinesAllergies: 5,
        noKnownOtherAllergies: 6,
        noKnownAllergies: 7,
    };
    Object.freeze(noKnownAllergiesInformation);


    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies types list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    $scope.allergiesAddEditGetAllergenTypeList = function () {
        AllergiesService.allergiesGetAllergenTypeList().then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesAddEditAllergenTypeList = serviceResponse;
            if (hasValue(serviceResponse) && serviceResponse.length > 0 && hasValue(serviceResponse[0])) {
                $scope.allergiesAddEditAllergiesDrugType = serviceResponse[0].AllergenTypeID;
            }
            $scope.allergiesAddEditGetCommonlyUsedDrugsList();//on init loading the common drugs list
        });
    };
    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK END #########################


    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies types list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    $scope.allergiesAddEditGetAllergiesListLinkedtoPatient = function () {
        var PostData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
        }

        AllergiesService.allergiesGetAllergiesListLinkedtoPatient(PostData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesAddEditLinkedAllergiesListForPatient = serviceResponse;

        });
    };
    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK END #########################



    //################### GET ALLERGIES SEVERITY  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies SEVERITY list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    $scope.allergiesAddEditGetSeverityList = function () {
        AllergiesService.allergiesGetAllergiesSeverityList().then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesAddEditSeverityTypeList = serviceResponse;
            if (hasValue(serviceResponse) && serviceResponse.length > 0 && hasValue(serviceResponse[0]) && hasValue(serviceResponse[0].AllergySeverityTypeID)) {
                $scope.allergiesAddEditAllergiesSeverityType = serviceResponse[0].AllergySeverityTypeID;
            }
            $timeout(function () {
                if ($scope.EMRDataFromPopup.selectedAllergyInfo)
                    $scope.allergiesAddEditAllergiesSeverityType = $scope.allergiesEditModeInfo.Severity;
            }, 100);
        });
    };
    //################### GET ALLERGIES SEVERITY  LIST  BLOCK END #########################



    //################### GET ALLERGIES ORGANS  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies ORGANS list FROM THE SERVICE
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/10/2014
    $scope.allergiesAddEditGetOrgansList = function () {
        AllergiesService.allergiesGetAllergiesOrgansList().then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.allergiesAddEditOrgansList = serviceResponse;
            if (hasValue(serviceResponse) && serviceResponse.length > 0 && hasValue(serviceResponse[0])) {
                $scope.allergiesAddEditAllergiesOrganType = serviceResponse[0].AllergiesMenifestationsUserAddedCategoryID;
            }
            if (!hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                $scope.allergiesAddEditGetManifestationList();
            }

        });
    };
    //################### GET ALLERGIES ORGANS  LIST  BLOCK START #########################



    ///on change event in the ddl select allergen dropdown
    $scope.allergiesAllergenddlOptions = {
        change: function (e) {
            //$scope.allergiesAddEditSearchDrug = "";
            $scope.txtSearchDrugFocus = true;
            if ($scope.allergiesAddEditAllergiesDrugType == "5" || $scope.allergiesAddEditAllergiesDrugType == 5) {
                $scope.allergiesShowVaccinesGrid = true;//if vaccines is selcted then showing the vaccines grid
            }
            else {
                $scope.allergiesShowVaccinesGrid = false;
            }

            if ($scope.allergiesAddEditAllergiesDrugType == "4") {
                if (hasValue($scope.EMRDataFromPopup.CurrentAllergiesCount) && $scope.EMRDataFromPopup.CurrentAllergiesCount > 0) {
                    $scope.IsFromDrugAllergenType = true;
                }
                else {
                    $scope.IsFromDrugAllergenType = false;
                }
            }
            else {
                $scope.IsFromDrugAllergenType = false;
            }

            if ($scope.allergiesAddEditAllergiesDrugType == "2") {
                if (hasValue($scope.selectedDrug)) {
                    if ($scope.selectedDrug.IsCommonlyUsed == false) {
                        $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = false;
                        $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = true;
                    }
                    else {
                        $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = true;
                        $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = false;
                    }
                }
            }
            else {
                $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = false;
                $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = false;
            }

            $scope.allergiesaddEditChangeAllergenType(); //Changing the NO KNOWN ALLERGIES BUTTON TEXT CHANGE METHOD.

            //$timeout(function () {
            $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
            //}, 500);
        }
    };


    $scope.allergiesAddEditDrugsGridOptionsDataSource = new kendo.data.DataSource({
        data: $scope.allergiesAddEditDrugsGridDataList,//assigning null on default  
        serverPaging: false,//lazy binding
        serverSorting: false,
        serverFiltering: false,
        pageSize: 50,
        batch: false
    });

    $scope.allergiesAddEditDrugsGridOptions = {
        dataSource: $scope.allergiesAddEditDrugsGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        selectable: "single row",
        scrollable: {
            virtual: true
        },
        //showCheckBoxColumn: true,
        columns: [
            {
                field: "RxNormCode",
                title: "Rx Norm / NDF - RT Code",
                width: 150,
                hidden: true,
                template: "<div title='#=RxNormCode#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=RxNormCode#</div>",
            },

            {
                field: "DrugName",
                title: "Allergen(s)",
                template: "<div title='#=DrugName#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=DrugName#</div>",

            },

        ]
    };

    $scope.allergiesAddEditVaccinessGridOptions = {
        dataSource: $scope.allergiesAddEditDrugsGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        mobileRedirect: false,
        selectable: "multiple row",
        showCheckBoxColumn: true,
        scrollable: {
            virtual: true
        },
        columns: [
            {
                field: "DrugName",
                title: "Allergen(s)",
                template: "<div title='#=DrugName#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=DrugName#</div>",

            },
        ]
    };

    //on change event in the grid
    $scope.allergiesAddEditDrugsGridOptions.change = function (e) {
        $scope.allergySavingModel.Allergen_IDs = "";//making the selected allergy iD as null for the previous
        var grid = $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid;
        $scope.selectedDrug = grid.dataItem(grid.select());
        // COMMENTED BY AKBAR ON 04/01/2020 AS WE DONT NEED THIS AS THIS GRID IS SINGLE ROW SELECTABLE
        //toggleSelectOnChange(e);//calling the select on change event to check the check box
        $scope.allergySavingModel.Allergen_IDs = $scope.selectedDrug.DrugID;//setting the selected drug 
        $scope.allergySavingModel.Allergen_TypeID = $scope.selectedDrug.AllergenType;//setting the selected drug 
        $scope.txtSearcManifestation = true;
        if ($scope.allergiesAddEditAllergiesDrugType == "2") {
            if (hasValue($scope.selectedDrug)) {
                if ($scope.selectedDrug.IsCommonlyUsed == false) {
                    $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = true;
                    $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = false;
                }
                else {
                    $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = false;
                    $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = true;
                }
            }
        }

        // ADDED BY AKBAR ON 04/01/2020 AS PART OF OPTIMIZATION OF TIME WHEN USER SELECTES THE DRUG INFORMATION
        // METHOD TO CALL STATE MAINTAIN MANIFESTATIONS DATA WHEN USER SELECTES ALLERGIES
        $scope.allergiesAddEditAutoSelectLinkedManifestationsBasedOnAllergenID($scope.selectedDrug);
    };

    //on dataBound event in the grid
    $scope.allergiesAddEditDrugsGridOptions.dataBound = function (e) {
        //this.element.find('tbody td:first').attr({ tabindex: 19403 });
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            e.sender.tbody.find("tr").removeClass('allergiesAddEditDrugsGridhasMenu');
            e.sender.tbody.find("tr").addClass('allergiesAddEditDrugsGridhasMenu');
            grid.table.attr("tabindex", 19403);
        }

        // COMMENTED BY AKBAR ON 04/01/2020 AS PART OF OPTIMIZATION OF TIME WHEN USER SELECTES THE DRUG INFORMATION
        //var Manifestationgrid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
        //if (hasValue(Manifestationgrid)) {
        //    $.each(Manifestationgrid.tbody.find('tr'), function () {
        //        var model = Manifestationgrid.dataItem(this);
        //        if (model.selected) {
        //            model.selected = false;
        //        }
        //    });
        //}

        // ADDED BY AKBAR ON 04/01/2020 AS PART OF OPTIMIZATION OF TIME WHEN USER SELECTES THE DRUG INFORMATION
        // CLEARLY PREVIOUSLY STATE MAINTAIN MANIFESTATIONS DATA
        $scope.allergiesAddEditUnCheckAllManifestations();


        kendoGridEmptyDataTemplate(this, '', '');
    };

    $scope.allergiesAddEditVaccinessGridOptions.change = function (e) {
        toggleSelectOnChange(e);//calling the select on change event to check the check box
        $scope.txtSearcManifestation = true;
        $scope.allergiesAddEditAutoSelectLinkedManifestationsBasedOnAllergenID();
    };

    //on dataBound event in the grid
    $scope.allergiesAddEditVaccinessGridOptions.dataBound = function (e) {
        //this.element.find('tbody td:first').attr({ tabindex: 19405 });
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 19405);
        }

        var Manifestationgrid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
        if (hasValue(Manifestationgrid)) {
            $.each(Manifestationgrid.tbody.find('tr'), function () {
                var model = Manifestationgrid.dataItem(this);
                if (model.selected) {
                    model.selected = false;
                }
            });
        }
        kendoGridEmptyDataTemplate(this, '', '');
    };


    //################### GET ALLERGIES DRUGS LIST BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the drugs list based on the search criteria
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in getting the drugs list based on the search criteria
    $scope.allergiesAddEditGetTheDrugListBasedOnSearch = function (IsFromNoDataAvailable) {



        if (IsFromNoDataAvailable) {
            //$scope.allergiesAddEditSearchDrug = "";
            $scope.txtSearchDrugFocus = true;
            if ($scope.allergiesAddEditAllergiesDrugType == "5" || $scope.allergiesAddEditAllergiesDrugType == 5) {
                $scope.allergiesShowVaccinesGrid = true;//if vaccines is selcted then showing the vaccines grid
            }
            else {
                $scope.allergiesShowVaccinesGrid = false;
            }

            if ($scope.allergiesAddEditAllergiesDrugType == "4") {
                if (hasValue($scope.EMRDataFromPopup.CurrentAllergiesCount) && $scope.EMRDataFromPopup.CurrentAllergiesCount > 0) {
                    $scope.IsFromDrugAllergenType = true;
                }
                else {
                    $scope.IsFromDrugAllergenType = false;
                }
            }
            else {
                $scope.IsFromDrugAllergenType = false;
            }

            if ($scope.allergiesAddEditAllergiesDrugType == "2") {
                if (hasValue($scope.selectedDrug)) {
                    if ($scope.selectedDrug.IsCommonlyUsed == false) {
                        $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = false;
                        $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = true;
                    }
                    else {
                        $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = true;
                        $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = false;
                    }
                }
            }
            else {
                $scope.allergiesAddEditDrugsGridContextMenuAddtoCommonListHideShow = false;
                $scope.allergiesAddEditDrugsGridContextMenuDeleteFromCommonListHideShow = false;
            }
        }












        //if (!(($scope.allergiesAddEditSearchDrug != undefined && $scope.allergiesAddEditSearchDrug.length >= 2))) {
        if (hasValue($scope.allergiesAddEditSearchDrug) && ($scope.allergiesAddEditSearchDrug.length <= 1)) {
            ShowErrorMessage("Please Enter Atleast 2 Characters to Search");
            $("#txtAllergiesDrugSearch_" + $scope.allergiesAddEditGUID).focus();
            return false;
        }
        var pageSizeForGrid;
        var allergiesAllergenGrid;
        $scope.allergySavingModel.Allergen_TypeID = $scope.allergiesAddEditAllergiesDrugType;//setting the drug type 

        //if the search string is empty then loading the commonly used list
        if (parseInt($scope.allergiesAddEditAllergiesDrugType) == 4) {
            if (!hasValue($scope.allergiesAddEditSearchDrug) || $scope.allergiesAddEditSearchDrug == "") {
                //$timeout(function () {
                $scope.allergiesAddEditGetCommonlyUsedDrugsList();
                //}, 500);
                return;
            }
        }
        if (parseInt($scope.allergiesAddEditAllergiesDrugType) == 999) {
            if (!hasValue($scope.allergiesAddEditSearchDrug) || $scope.allergiesAddEditSearchDrug == "") {
                $scope.allergiesAddEditGetAllDrugsList();
                return;
            }
        }
        var serviceData = {
            SearchString: $scope.allergiesAddEditSearchDrug,
            //AllergenType: parseInt($scope.allergiesAddEditAllergiesDrugType),
            SearchMode: 2//any part-2,1-starts with
        };

        if (hasValue($scope.allergiesAddEditAllergiesDrugType) && $scope.allergiesAddEditAllergiesDrugType > 0) {
            serviceData.AllergenType = parseInt($scope.allergiesAddEditAllergiesDrugType);
        }
        else {
            serviceData.AllergenType = 0;
        }

        $scope.allergiesAddEditDrugsGridDataList = [];//clearing the previous list

        AllergiesService.allergiesGetAllergyDrugsList(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;

            if (!hasValue(serviceResponse) || serviceResponse.length <= 0) {
                if ($scope.allergiesAddEditAllergiesDrugType == "4") {
                    $scope.allergiesAddEditAllergiesDrugType = 2;
                    $scope.allergiesAddEditGetTheDrugListBasedOnSearch(true);
                    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                }
                else if ($scope.allergiesAddEditAllergiesDrugType == "2") {
                    $scope.allergiesAddEditAllergiesDrugType = 3;
                    $scope.allergiesAddEditGetTheDrugListBasedOnSearch(true);
                    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                }
                else if ($scope.allergiesAddEditAllergiesDrugType == "3") {
                    $scope.allergiesAddEditAllergiesDrugType = 6;
                    $scope.allergiesAddEditGetTheDrugListBasedOnSearch(true);
                    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                }
                else if ($scope.allergiesAddEditAllergiesDrugType == "6") {
                    $scope.allergiesAddEditAllergiesDrugType = 999;
                    $scope.allergiesAddEditGetTheDrugListBasedOnSearch(true);
                    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                }
                //else if ($scope.allergiesAddEditAllergiesDrugType == "5") {
                //    $scope.allergiesAddEditAllergiesDrugType = 6;
                //    $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
                //    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                //}
                else if ($scope.allergiesAddEditAllergiesDrugType == "999") {
                    $scope.allergiesAddEditAllergiesDrugType = 999;
                    //$scope.allergiesAddEditWidgets.allergiesAddEditddlAllergenType.trigger("change");
                }

            }


            $scope.allergiesAddEditDrugsGridDataList = serviceResponse;
            if (serviceResponse.length > 0) {
                if (serviceResponse.length <= 30)
                    pageSizeForGrid = 20;//if the no.of records are less 
                else
                    pageSizeForGrid = 60;//if the no.of records are huge
            }
            var newDataSource = new kendo.data.DataSource({
                data: $scope.allergiesAddEditDrugsGridDataList,
                serverPaging: false,//lazy binding
                serverSorting: false,//lazy binding
                serverFiltering: false,//lazy binding
                pageSize: pageSizeForGrid,
                batch: true
            });
            if ($scope.allergiesAddEditAllergiesDrugType != "5" || $scope.allergiesAddEditAllergiesDrugType != 5)//if selected allergen type is not a vaccine
                allergiesAllergenGrid = $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid;
            else
                allergiesAllergenGrid = $scope.allergiesAddEditWidgets.allergiesAddEditVaccinesGrid;

            newDataSource.read();//reading the data source for assigning it to the dgrid
            allergiesAllergenGrid.setDataSource(newDataSource);//setting the new data source every time                     
            $scope.allergySavingModel.Allergen_IDs = "";//after succesfull search clearing the previously selected allergen iD
        });

    };
    //################### GET ALLERGIES DRUGS LIST BLOCK END #########################


    //################### GET ALLERGIES DRUGS  COMMONLY USED DRUGS LIST BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the Commonly used drugs list 
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/10/2014    
    $scope.allergiesAddEditGetCommonlyUsedDrugsList = function () {

        var serviceData = {
            SearchString: EMRStringSeperator,
            AllergenType: $scope.allergiesAddEditAllergiesDrugType,
            SearchMode: 2//any part-2,1-starts with
        };

        AllergiesService.allergiesGetAllergyDrugsCommonlyUsedList(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            if (!hasValue(serviceResponse) || serviceResponse.length == 0) return false;
            var pageSizeForGrid;
            var allergiesAllergenGrid;
            if (serviceResponse.length > 100) {
                pageSizeForGrid = 60;//if the no.of records are huge
            }
            else {
                pageSizeForGrid = serviceResponse.length;
            }
            $scope.allergiesAddEditDrugsGridDataList = serviceResponse;
            var newDataSource = new kendo.data.DataSource({
                data: $scope.allergiesAddEditDrugsGridDataList,
                serverPaging: false,//lazy binding
                serverSorting: false,//lazy binding
                serverFiltering: false,//lazy binding
                pageSize: pageSizeForGrid,
                batch: true
            });
            allergiesAllergenGrid = $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid;
            if (!hasValue(allergiesAllergenGrid)) {
                $scope.allergiesAddEditDrugsGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source
                return false;
            }
            newDataSource.read();//reading the data source for assigning it to the dgrid
            allergiesAllergenGrid.setDataSource(newDataSource);//setting the new data source every time    
            //   $scope.allergiesAddEditDrugsGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source   
            $scope.allergySavingModel.Allergen_IDs = "";//after succesfull search clearing the previously selected allergen iD
        });

    };
    //################### GET ALLERGIES DRUGS  COMMONLY USED DRUGS LIST BLOCK END #########################


    $scope.allergiesAddEditManifestationGridOptionsDataSource = new kendo.data.DataSource({
        data: [],//assigning null on default       
    });

    $scope.allergiesAddEditManifestationGridOptions = {
        dataSource: $scope.allergiesAddEditManifestationGridOptionsDataSource,
        sortable: true,
        navigatable: true,
        mobileRedirect: false,
        selectable: "multiple row",
        showCheckBoxColumn: true,
        columns: [
            {
                field: "AllergiesManifestationsUserAddedName",
                title: "Manifestation(s)",
                template: "<div title='#=AllergiesManifestationsUserAddedName#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=AllergiesManifestationsUserAddedName#</div>",

            },
            {
                field: "SNOMEDCode",
                title: "SNOMED Code",
                width: 136,
                hidden: true,
                template: "<div title='#=SNOMEDCode#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=SNOMEDCode#</div>",
            },
            {
                field: "ManifestationCodeStatus",
                title: "Status",
                width: 100,
                hidden: true,
                template: "<div title='#=ManifestationCodeStatus#' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden'>#=ManifestationCodeStatus#</div>",
            },
        ]
    };

    $scope.allergiesAddEditManifestationGridOptions.change = function (e) {
        toggleSelectOnChange(e);//calling the select on change event to check the check box
    };

    // COMMENTED BY AKBAR ON 04/01/2020 AS PART OF OPTIMIZATION OF TIME WHEN USER SELECTES THE DRUG INFORMATION
    ////###########################  ON DATA BOUND EVENT IN THE MANIFESTATIONS GRID BLOCK START  ################///////
    //on dataBound event in the grid
    //$scope.allergiesAddEditManifestationGridOptions.dataBound = function (e) {
    //    kendoGridEmptyDataTemplate(this, '', '');
    //    //this.element.find('tbody td:first').attr({ tabindex: 19407 });
    //    var grid = e.sender;
    //    if (grid.dataSource.data().length > 0) {
    //        grid.table.attr("tabindex", 19411);
    //    }
    //    ///these lines of code is useful in state maintaining the code
    //    var grid = e.sender;//getting the grid data
    //    //if the allergy is opened in edit mode then the following data bound event 
    //    if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {

    //        $scope.allergySavingModel.MenifestationIDs = $scope.allergiesEditModeInfo.MenifestationIDs;//maintainig the previously selected menifestation ID's

    //        var prevMenifestations = $scope.allergySavingModel.MenifestationIDs;
    //        //var prevMenifestaionNamesString = $scope.allergiesEditModeInfo.MenifestationNames;

    //        var prevMenifestationsIds = new Array();//building the array of the menifestaions iD's
    //        prevMenifestationsIds = prevMenifestations.split(",");//splitting the comma space separated string into array of strings

    //        //var prevMenifestaionNamesArray = new Array();//building the array of the menifestaions Name's
    //        //prevMenifestaionNamesArray = prevMenifestaionNamesString.split(",");//splitting the comma space separated string into array of strings

    //        //state maintainig in the edit mode by selecting the previous values in the grid
    //        for (var index in prevMenifestationsIds) {

    //            if ((prevMenifestationsIds[index] == 99999999 || prevMenifestationsIds[index] == "99999999") && $scope.previousAllergyType != 5 && hasValue($scope.allergiesEditModeInfo.MenifestationNames_FreeText)) {//if not allergic donot populate
    //                $scope.allergiesAddEditTypeFreeTextManifestations = $scope.allergiesEditModeInfo.MenifestationNames_FreeText;
    //            }
    //            else {
    //                //This condition is used to perform search operation in Editable Mode
    //                if (hasValue($scope.isFromEditManifestationSearch) && $scope.isFromEditManifestationSearch == false) {
    //                    //LOOPING ON EACH ROW OF THE GRID WHICH WAS PREVIOUSLY SELCTED
    //                    $.each(grid.tbody.find('tr'), function () {
    //                        var model = grid.dataItem(this);//EACH ITEM OF THE ROW
    //                        if (model.AllergiesManifestationsUserAddedId == prevMenifestationsIds[index]) {
    //                            model.selected = true;
    //                            //grid.select(this);//SELECTING THE ROW
    //                        }
    //                    });
    //                }
    //            }
    //        }
    //        //state maintainig in the edit mode by selecting the previous values in the grid
    //    }
    //};
    ////###########################  ON DATA BOUND EVENT IN THE MANIFESTATIONS GRID BLOCK END  ################///////


    // ###########################  ON DATA BOUND EVENT IN THE MANIFESTATIONS GRID BLOCK START  ################
    // PURPOSE: THIS METHOD IS USED AS DATA BOUND EVENT FOR THE MANIFESTATIONS GRID 
    // CREATED BY: AKBAR
    // CREATED ON: 04/01/2020
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesAddEditManifestationGridOptions.dataBound = function (e) {

        // KENDO GRID EMPTY DATA TEMPLATE
        kendoGridEmptyDataTemplate(this, '', '');

        //THESE LINES OF CODE IS USEFUL IN STATE MAINTAINING THE CODE
        var grid = e.sender;
        // MAINTAINING TB INDEX
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 19411);
        }

        //IF THE ALLERGY IS OPENED IN EDIT MODE THEN THE FOLLOWING DATA BOUND EVENT 
        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo) && hasValue($scope.allergiesEditModeInfo) &&
            hasValue($scope.allergiesEditModeInfo.MenifestationIDs)) {

            //MAINTAINIG THE PREVIOUSLY SELECTED MENIFESTATION ID'S
            $scope.allergySavingModel.MenifestationIDs = $scope.allergiesEditModeInfo.MenifestationIDs;

            // SPLITING MANIFESTATIONS DATA ALREADY SAVED SO THAT WE CAN SAVE IN ARRAY
            var prevMenifestationsIds = $scope.allergySavingModel.MenifestationIDs.split(",");

            // AS WE REQUIRE ID AS INTEGERS MAKING ALL THE ITEMS IN GRID AS INTEGERS
            prevMenifestationsIds = prevMenifestationsIds.map(function (eachMenifestationsId) { return parseInt(eachMenifestationsId) });

            // VERIFYING WETHER THE MANIFESTATION SAVED AS FREE TEXT
            if (prevMenifestationsIds.includes(99999999) && $scope.previousAllergyType != 5 && hasValue($scope.allergiesEditModeInfo.MenifestationNames_FreeText)) {
                // STATE MAINTAINING FREE TEXT
                $scope.allergiesAddEditTypeFreeTextManifestations = $scope.allergiesEditModeInfo.MenifestationNames_FreeText;
            }

            //STATE MAINTAINIG IN THE EDIT MODE BY SELECTING THE PREVIOUS VALUES IN THE GRID
            if (prevMenifestationsIds.length > 1 ||
                (prevMenifestationsIds.length == 1 && !prevMenifestationsIds.includes(99999999))) {
                // LOOPING ACROSS MANIFESTATIONS DATA TO STATE MAINTAIN DATA
                $.each(grid.tbody.find('tr'), function () {
                    // GET THE DATA ITEM OF ANIFESTATION
                    var eachManifestation = grid.dataItem(this);
                    // IF MANIFESTATION IS ALREADY SAVED FOR USER THEN SELECTING THE MANIFESTATION DATA
                    if (prevMenifestationsIds.includes(eachManifestation.AllergiesManifestationsUserAddedId)) {
                        eachManifestation.selected = true;
                    }
                });
            }
        }
        // AND WE NEED TO STATE MAINTAIN EVEN WHEN USER RELOAD THE GRID INFO
        else if (hasValue($scope.selectedDrug)) {
            // METHOD TO CALL STATE MAINTAIN MANIFESTATIONS DATA WHEN USER SELECTES ALLERGIES
            $scope.allergiesAddEditAutoSelectLinkedManifestationsBasedOnAllergenID($scope.selectedDrug);
        }
    };
    // ###########################  ON DATA BOUND EVENT IN THE MANIFESTATIONS GRID BLOCK START  ################


    //################### GET ALLERGIES MANIFESTATIONS LIST BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the drugs  manifestation list based on the search criteria
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in getting the drugs list based on the search criteria
    $scope.allergiesAddEditGetTheManifestationListBasedOnSearch = function () {
        if ($scope.pastHxAllergiesSearchDrugFocus == true) {
            $scope.txtSearchDrugFocus = true;
            $scope.pastHxAllergiesSearchDrugFocus = false;
        }
        else {
            if (hasValue($scope.allergiesAddEditSearchSnomedCode)) {
                $scope.txtSearcSnomedCode = true;
            } else {
                $scope.txtSearcManifestation = true;
            }
        }
        $scope.allergiesAddEditGetManifestationList($scope.allergiesAddEditSearchManifestations);
    };
    //this method is useful in getting the manifestation list based on the user search string from the service
    $scope.allergiesAddEditGetManifestationList = function (allergiesManifestationSearchString) {
        var serviceData = {
            SearchString: allergiesManifestationSearchString,
        };
        if ($scope.allergiesAddEditAllergiesOrganType == "-1")//all
        {
            serviceData.IsCommonlyUsed = false;
        }
        else if ($scope.allergiesAddEditAllergiesOrganType == "0") {//common list
            serviceData.IsCommonlyUsed = true;
        }
        else {
            serviceData.AllergiesManifestationsUserAddedCategoryID = $scope.allergiesAddEditAllergiesOrganType;
        }

        serviceData.SNOMEDCode = $scope.allergiesAddEditSearchSnomedCode;
        serviceData.ManifestationCodeStatus = $scope.allergiesAddEditDropdown;

        AllergiesService.allergiesGetAllergyManifestationList(serviceData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;

            if (serviceResponse.length == 0) {
                if ($scope.allergiesAddEditAllergiesOrganType == "0") {
                    $scope.allergiesAddEditAllergiesOrganType = "-1";//setitng the all if not found in the common data
                    $scope.allergiesAddEditGetManifestationList($scope.allergiesAddEditSearchManifestations);//calling the change event
                }
            }

            $scope.allergiesAddEditManifestationGridOptionsDataSource.data(serviceResponse);//refreshing the grid data source      
        });
    };

    //################### GET ALLERGIES MANIFESTATIONS LIST BLOCK END #########################





    /////##############    ALLERGIES ADD EDIT BUTTONS CLICK EVENTS BLOCK START   #########//////
    $scope.allergiesAddEditAllergicClick = function () {
        $scope.allergiesAddEditSaveAllergies(1, true);//allergies
        //$scope.OK();
    };

    $scope.allergiesAddEditNotAllergicClick = function () {
        $scope.allergiesAddEditSaveAllergies(2, true);//not allergent
        // $scope.OK();
    };
    $scope.allergiesAddEditInToleranceClick = function () {
        $scope.allergiesAddEditSaveAllergies(3, true);//intolerance
        // $scope.OK();
    };
    $scope.allergiesAddEditAdverseReactionClick = function () {
        $scope.allergiesAddEditSaveAllergies(4, true);//adverse reaction
        // $scope.OK();
    };
    /////##############     ALLERGIES ADD EDIT BUTTONS CLICK EVENTS BLOCK END   #########//////

    $scope.allergiesAddEditSelectedAllergicClick = function () {
        $scope.allergiesAddEditSaveAllergies(1);//allergies
    };
    $scope.allergiesAddEditSelectedInToleranceClick = function () {
        $scope.allergiesAddEditSaveAllergies(3);//intolerance
    };
    $scope.allergiesAddEditSelectedAdverseReactionClick = function () {
        $scope.allergiesAddEditSaveAllergies(4);//adverse reaction
    };

    //################### SAVE ALLERGIC TO UNKNOWN DRUG INFO BLOCK START #########################
    //*******PURPOSE: THIS METHOD IS USED TO SAVE THE ALLERGIES INFORMAION AS ALLERGIC TO UNKNOWN DRUG.
    //*******CREATED BY:  SRINIVAS M
    //*******CREATED DATE: 02/19/2015
    //THIS METHOD IS USEFUL FOR SAVING THE ALLERGIC TO UNKNOWN DRUG STATUS
    $scope.allergiesAddEditAllergicToUnknownDrug = function () {

        $scope.allergySavingModel.PatientID = $scope.EMRDataFromPopup.PatientID;
        $scope.allergySavingModel.Allergen_IDs = -666666;
        $scope.allergySavingModel.Allergen_TypeID = 4;
        $scope.allergySavingModel.Severity = -1;
        $scope.allergySavingModel.Allergy_DOS = adminGetCurrentDate();
        $scope.allergySavingModel.AppointmentID = $scope.EMRDataFromPopup.AppointmentID;
        $scope.allergySavingModel.NKAllergen_IDs = "777777,999999,-55555";

        AllergiesService.allergiesSavePatientAllergies($scope.allergySavingModel).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            $scope.OK();//on success save close
        });

    }
    //################### SAVE ALLERGIC TO UNKNOWN DRUG INFO BLOCK END #########################


    //################### SAVE ALLERGY INFO BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the drugs  manifestation list based on the search criteria
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    //this method is useful in saving the sedlected allergies drugs and manifestation information in the data base
    $scope.allergiesAddEditSaveAllergies = function (saveAllergyType, IsPopupClose) {




        //in case of add new only we do this
        if (!$scope.allergiesEditMode) {
            //var gridDrugsDta = [];
            $scope.allergiesSelectedAllergenIDs = "";//on init
            if ($scope.allergiesShowVaccinesGrid) {

                //if the vaccine items are selected then we are reading the grid data and getting the selected items in the grid
                $scope.allergiesSelectedRowsRecordsInDrugs = getSelectedRowsFromGrid($scope.allergiesAddEditWidgets.allergiesAddEditVaccinesGrid);

                //gridDrugsDta = $scope.allergiesAddEditWidgets.allergiesAddEditVaccinesGrid.dataSource.data();//getting the data from the vaccines grid
                //$scope.allergiesSelectedRowsRecordsInDrugs = $.grep(gridDrugsDta, function (element, index) {
                //    return element.selected == true; // retain appropriate elements
                //});
                $scope.allergiesSelectedAllergenIDs = "";

                ///######   MAKING THE SELECTED VACCINE ITEMS AS COMMA SEPERATED ##############//
                for (var index in $scope.allergiesSelectedRowsRecordsInDrugs) {
                    if (hasValue($scope.allergiesSelectedRowsRecordsInDrugs[index].DrugID)) {
                        //if ($scope.allergiesSelectedRowsRecordsInDrugs[index].DrugID != null && $scope.allergiesSelectedRowsRecordsInDrugs[index].DrugID != undefined)
                        $scope.allergiesSelectedAllergenIDs = $scope.allergiesSelectedAllergenIDs + $scope.allergiesSelectedRowsRecordsInDrugs[index].DrugID + ",";
                    }
                }
                $scope.allergiesSelectedAllergenIDs = $scope.allergiesSelectedAllergenIDs.substring(0, $scope.allergiesSelectedAllergenIDs.length - 1);//removing the last char
                $scope.allergySavingModel.Allergen_IDs = $scope.allergiesSelectedAllergenIDs;
                ///######   MAKING THE SELECTED VACCINE ITEMS AS COMMA SEPERATED ##############//
            }

        }


        if (!hasValue($scope.allergySavingModel.Allergen_IDs) || $scope.allergySavingModel.Allergen_IDs == "") {

            if (hasValue($scope.allergiesForPatientFreeText)) {
                $scope.AlergiesFreeTextSaving(IsPopupClose);
                return false;
            }
            else {
                ShowErrorMessage('Please Select Allergen / Enter Free Text.');
                $("#txtAllergiesDrugSearch_" + $scope.allergiesAddEditGUID).focus();
                return false;
            }
        }

        //getting the selected items in the grid
        $scope.selectedRowsRecordsInMenifestation = getSelectedRowsFromGrid($scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid);


        //ADDED BY HEMANTH ON MAY 18 2K18 
        var allergiesManifesationsList = [];
        var UserAddedIDNotExist = false;
        //SNOMED CODE 
        if (hasValue($scope.selectedRowsRecordsInMenifestation)) {
            for (var cnt = 0; cnt < $scope.selectedRowsRecordsInMenifestation.length; cnt++) {
                if (!hasValue($scope.selectedRowsRecordsInMenifestation[cnt].AllergiesManifestationsUserAddedId) || $scope.selectedRowsRecordsInMenifestation[cnt].AllergiesManifestationsUserAddedId == 0) {
                    UserAddedIDNotExist = true;
                }
            }
        }

        //MANIFESTATIONS SELECTED FROM THE MASTER LIST THEN SAVE THOSE DETAILS IN THE PRACTICE REALTED TABLE 
        if (UserAddedIDNotExist) {
            var postData = {};

            postData.ManifestationsList = $scope.selectedRowsRecordsInMenifestation;
            AllergiesService.allergiesSaveManifestationsFromSnomedMasterList(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) return false;

                $scope.manifestationsSelectedRowsRecordsMultiple = "";//initial data

                if (hasValue(serviceResponse) && hasValue(serviceResponse.ManifestationsList) && serviceResponse.ManifestationsList.length > 0) {
                    angular.forEach(serviceResponse.ManifestationsList, function (item, index) {
                        if (hasValue(item.AllergiesManifestationsUserAddedId))
                            $scope.manifestationsSelectedRowsRecordsMultiple = $scope.manifestationsSelectedRowsRecordsMultiple + item.AllergiesManifestationsUserAddedId + ",";
                    });
                    $scope.manifestationsSelectedRowsRecordsMultiple = $scope.manifestationsSelectedRowsRecordsMultiple.substring(0, $scope.manifestationsSelectedRowsRecordsMultiple.length - 1);//removing the last char
                }

                //###################  SETTING THE COMMA SEPARATED VALUES OF THE SELECTED MENIFESTATIONS  #############//

                $scope.allergySavingModel.PatientID = $scope.EMRDataFromPopup.PatientID;
                $scope.allergySavingModel.MenifestationIDs = $scope.manifestationsSelectedRowsRecordsMultiple;

                //CHECKING IS THERE ANY MANIFESTATION IS SELECTED OR NOT WHILE DOCUMENTING THE ALLERGIES
                if (hasValue($scope.allergySavingModel.MenifestationIDs)) {
                    //RELATED TO THE ISCUSTOMMANIFESTATION FLAG UPDATION WHILE DOCUMENTING THE MANIFESTATIONS FROM THE ALLERGIES WINDOW 
                    //ISSUE SAID BY KUMARA GARU
                    $scope.allergySavingModel.IsCustomManifestation = true;
                }

                //if free text manifestations has value then also adding it to the list
                if (hasValue($scope.allergiesAddEditTypeFreeTextManifestations)) {
                    $scope.allergySavingModel.AllergiesMenifestation_FreeTextReaction = $scope.allergiesAddEditTypeFreeTextManifestations;
                    if (hasValue($scope.allergySavingModel.MenifestationIDs) || $scope.allergySavingModel.MenifestationIDs != "") {
                        $scope.allergySavingModel.MenifestationIDs = $scope.allergySavingModel.MenifestationIDs + ",99999999";//for free text menifestaion id is 99999999
                    }
                    else {
                        $scope.allergySavingModel.MenifestationIDs = "99999999";
                    }
                    //$scope.allergySavingModel.IsCustomManifestation = true;
                }

                $scope.allergySavingModel.AppointmentID = $scope.EMRDataFromPopup.AppointmentID;

                $scope.allergySavingModel.Severity = $scope.allergiesAddEditAllergiesSeverityType;

                //INTOLERANCE
                if (saveAllergyType == 3) {
                    $scope.allergySavingModel.Intolerable = true;
                    $scope.allergySavingModel.IsAdverseReaction = false;
                    $scope.allergySavingModel.IsNotAllergic = false;
                }
                // ADVERSE REACTION
                else if (saveAllergyType == 4) {
                    $scope.allergySavingModel.IsAdverseReaction = true;
                    $scope.allergySavingModel.Intolerable = false;
                    $scope.allergySavingModel.IsNotAllergic = false;
                }
                //ALLERGIC CASE
                else if (saveAllergyType == 1) {
                    $scope.allergySavingModel.IsNotAllergic = false;
                    $scope.allergySavingModel.IsAdverseReaction = false;
                    $scope.allergySavingModel.Intolerable = false;
                }
                //NOT ALLERGIC CASE
                else if (saveAllergyType == 2) {
                    $scope.allergySavingModel.MenifestationIDs = "";
                    $scope.allergySavingModel.Severity = 0;
                    $scope.allergySavingModel.IsNotAllergic = true;
                    $scope.allergySavingModel.IsAdverseReaction = false;
                    $scope.allergySavingModel.Intolerable = false;
                }


                //$scope.allergySavingModel.NKAllergen_IDs = "777777,-666666,999999,-555555";
                $scope.allergySavingModel.NKAllergen_IDs = "777777,999999,-55555";

                $scope.allergySavingModel.Allergy_DOS = adminGetCurrentDate();

                if (hasValue($scope.allergySavingModel.AllergyDetailsID)) {
                    $scope.allergySavingModel.IsAllergiesModified = true;
                }

                AllergiesService.allergiesSavePatientAllergies($scope.allergySavingModel).then(function (serviceResponse) {
                    if (isError(serviceResponse)) {
                        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                        else {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                        return false;
                    }
                    //if the user wants to update the allergic to not allergic then this confirmation may raise
                    if (serviceResponse.confirmationModelList != null) {
                        if (serviceResponse.confirmationModelList.length > 0) {
                            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), serviceResponse.confirmationModelList[0].ConformationMessage, 'md').then(function (result) {
                                if (result == "NO") {
                                    $scope.allergySavingModel.Intolerable = undefined;//making the flags undefined for next selection
                                    $scope.allergySavingModel.IsAdverseReaction = undefined;//making the flags undefined for next selection
                                    $scope.allergySavingModel.IsNotAllergic = undefined;//making the flags undefined for next selection
                                    return false;
                                }
                                else if (result == "YES") {
                                    $scope.allergySavingModel.IsConfirmationRequired = false;
                                    $scope.allergiesAddEditSaveAllergies(saveAllergyType, IsPopupClose);
                                }
                            });
                        }
                        else {
                            if (hasValue($scope.allergiesEditMode) && $scope.allergiesEditMode == true) {
                                $scope.OK();//on success save close in edit mode
                            }
                            else if (IsPopupClose == true) {
                                if (hasValue($scope.allergiesForPatientFreeText)) {
                                    $scope.AlergiesFreeTextSaving(IsPopupClose);
                                }
                                else {
                                    $scope.OK();
                                }
                            }
                            else {
                                if (hasValue($scope.allergiesForPatientFreeText)) {
                                    $scope.AlergiesFreeTextSaving();
                                }
                                // $scope.OK();//on success save close
                                ShowSuccessMessage("Allergies Information saved Successfully.");
                                $scope.allergiesAddEditSaveAllergiesInformationClick = true;
                                $scope.allergisforPatientCancelButtonText = "Close";
                                $scope.allergiesAddEditAllergiesOrganType = "0";
                                $scope.allergiesAddEditAllergiesSeverityType = 0;
                                $scope.allergiesAddEditTypeFreeTextManifestations = "";
                                //$scope.allergiesAddEditAllergiesDrugType = "4";
                                // $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
                                //$scope.allergiesAddEditAllergiesDrugType = $scope.AllergenTypeID;
                                $scope.allergiesAllergenddlOptions.change();
                                $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
                            }
                        }
                        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                        else {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                    }
                    else {

                        if (hasValue($scope.allergiesEditMode) && $scope.allergiesEditMode == true) {
                            $scope.OK();//on success save close in edit mode
                        }
                        else if (IsPopupClose == true) {
                            if (hasValue($scope.allergiesForPatientFreeText)) {
                                $scope.AlergiesFreeTextSaving(IsPopupClose);
                            }
                            else {
                                $scope.OK();
                            }
                        }
                        else {
                            if (hasValue($scope.allergiesForPatientFreeText)) {
                                $scope.AlergiesFreeTextSaving();
                            }

                            // $scope.OK();//on success save close
                            ShowSuccessMessage("Allergies Information saved Successfully.");
                            $scope.allergiesAddEditSaveAllergiesInformationClick = true;
                            $scope.allergisforPatientCancelButtonText = "Close";
                            $scope.allergiesAddEditAllergiesOrganType = "0";
                            $scope.allergiesAddEditAllergiesSeverityType = 0;
                            $scope.allergiesAddEditTypeFreeTextManifestations = "";
                            //$scope.allergiesAddEditAllergiesDrugType = "4";
                            //  $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
                            //$scope.allergiesAddEditAllergiesDrugType = $scope.AllergenTypeID;

                            $scope.allergiesAllergenddlOptions.change();
                            $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
                        }

                        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                        else {
                            EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                        }
                    }

                });

            })
        }
        else {

            $scope.manifestationsSelectedRowsRecordsMultiple = "";//initial data

            //var gridManifestationData = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid.dataSource.data();//reading the grid data source
            //$scope.selectedRowsRecordsInMenifestation = $.grep(gridManifestationData, function (element, index) {
            //    return element.selected == true; // retain appropriate elements
            //});


            //###################  SETTING THE COMMA SEPARATED VALUES OF THE SELECTED MENIFESTATIONS  #############//


            if (hasValue($scope.selectedRowsRecordsInMenifestation) && $scope.selectedRowsRecordsInMenifestation.length > 0) {

                angular.forEach($scope.selectedRowsRecordsInMenifestation, function (item, index) {
                    if (hasValue(item.AllergiesManifestationsUserAddedId))
                        $scope.manifestationsSelectedRowsRecordsMultiple = $scope.manifestationsSelectedRowsRecordsMultiple + item.AllergiesManifestationsUserAddedId + ",";
                });

                $scope.manifestationsSelectedRowsRecordsMultiple = $scope.manifestationsSelectedRowsRecordsMultiple.substring(0, $scope.manifestationsSelectedRowsRecordsMultiple.length - 1);//removing the last char
            }

            //###################  SETTING THE COMMA SEPARATED VALUES OF THE SELECTED MENIFESTATIONS  #############//

            $scope.allergySavingModel.PatientID = $scope.EMRDataFromPopup.PatientID;
            $scope.allergySavingModel.MenifestationIDs = $scope.manifestationsSelectedRowsRecordsMultiple;

            //CHECKING IS THERE ANY MANIFESTATION IS SELECTED OR NOT WHILE DOCUMENTING THE ALLERGIES
            if (hasValue($scope.allergySavingModel.MenifestationIDs)) {
                //RELATED TO THE ISCUSTOMMANIFESTATION FLAG UPDATION WHILE DOCUMENTING THE MANIFESTATIONS FROM THE ALLERGIES WINDOW 
                //ISSUE SAID BY KUMARA GARU
                $scope.allergySavingModel.IsCustomManifestation = true;
            }

            //if free text manifestations has value then also adding it to the list
            if (hasValue($scope.allergiesAddEditTypeFreeTextManifestations)) {
                $scope.allergySavingModel.AllergiesMenifestation_FreeTextReaction = $scope.allergiesAddEditTypeFreeTextManifestations;
                if (hasValue($scope.allergySavingModel.MenifestationIDs) || $scope.allergySavingModel.MenifestationIDs != "") {
                    $scope.allergySavingModel.MenifestationIDs = $scope.allergySavingModel.MenifestationIDs + ",99999999";//for free text menifestaion id is 99999999
                }
                else {
                    $scope.allergySavingModel.MenifestationIDs = "99999999";
                }
                //$scope.allergySavingModel.IsCustomManifestation = true;
            }

            $scope.allergySavingModel.AppointmentID = $scope.EMRDataFromPopup.AppointmentID;

            $scope.allergySavingModel.Severity = $scope.allergiesAddEditAllergiesSeverityType;

            //INTOLERANCE
            if (saveAllergyType == 3) {
                $scope.allergySavingModel.Intolerable = true;
                $scope.allergySavingModel.IsAdverseReaction = false;
                $scope.allergySavingModel.IsNotAllergic = false;
            }
            // ADVERSE REACTION
            else if (saveAllergyType == 4) {
                $scope.allergySavingModel.IsAdverseReaction = true;
                $scope.allergySavingModel.Intolerable = false;
                $scope.allergySavingModel.IsNotAllergic = false;
            }
            //ALLERGIC CASE
            else if (saveAllergyType == 1) {
                $scope.allergySavingModel.IsNotAllergic = false;
                $scope.allergySavingModel.IsAdverseReaction = false;
                $scope.allergySavingModel.Intolerable = false;
            }
            //NOT ALLERGIC CASE
            else if (saveAllergyType == 2) {
                $scope.allergySavingModel.MenifestationIDs = "";
                $scope.allergySavingModel.Severity = 0;
                $scope.allergySavingModel.IsNotAllergic = true;
                $scope.allergySavingModel.IsAdverseReaction = false;
                $scope.allergySavingModel.Intolerable = false;
            }


            //$scope.allergySavingModel.NKAllergen_IDs = "777777,-666666,999999,-555555";
            $scope.allergySavingModel.NKAllergen_IDs = "777777,999999,-55555";

            $scope.allergySavingModel.Allergy_DOS = adminGetCurrentDate();

            if (hasValue($scope.allergySavingModel.AllergyDetailsID)) {
                $scope.allergySavingModel.IsAllergiesModified = true;
            }

            AllergiesService.allergiesSavePatientAllergies($scope.allergySavingModel).then(function (serviceResponse) {
                if (isError(serviceResponse)) {
                    if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                    else {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                    return false;
                }
                //if the user wants to update the allergic to not allergic then this confirmation may raise
                if (serviceResponse.confirmationModelList != null) {
                    if (serviceResponse.confirmationModelList.length > 0) {
                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), serviceResponse.confirmationModelList[0].ConformationMessage, 'md').then(function (result) {
                            if (result == "NO") {
                                $scope.allergySavingModel.Intolerable = undefined;//making the flags undefined for next selection
                                $scope.allergySavingModel.IsAdverseReaction = undefined;//making the flags undefined for next selection
                                $scope.allergySavingModel.IsNotAllergic = undefined;//making the flags undefined for next selection
                                return false;
                            }
                            else if (result == "YES") {
                                $scope.allergySavingModel.IsConfirmationRequired = false;
                                $scope.allergiesAddEditSaveAllergies(saveAllergyType, IsPopupClose);

                            }
                        });
                    }
                    else {
                        if (hasValue($scope.allergiesEditMode) && $scope.allergiesEditMode == true) {
                            $scope.OK();//on success save close in edit mode
                        }
                        else if (IsPopupClose == true) {
                            if (hasValue($scope.allergiesForPatientFreeText)) {
                                $scope.AlergiesFreeTextSaving(IsPopupClose);
                            }
                            else {
                                $scope.OK();
                            }
                        }
                        else {
                            if (hasValue($scope.allergiesForPatientFreeText)) {
                                $scope.AlergiesFreeTextSaving();
                            }
                            // $scope.OK();//on success save close
                            ShowSuccessMessage("Allergies Information saved Successfully.");
                            $scope.allergiesAddEditSaveAllergiesInformationClick = true;
                            $scope.allergisforPatientCancelButtonText = "Close";
                            $scope.allergiesAddEditAllergiesOrganType = "0";
                            $scope.allergiesAddEditAllergiesSeverityType = 0;
                            $scope.allergiesAddEditTypeFreeTextManifestations = "";
                            //$scope.allergiesAddEditAllergiesDrugType = "4";
                            // $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
                            //$scope.allergiesAddEditAllergiesDrugType = $scope.AllergenTypeID;
                            $scope.allergiesAllergenddlOptions.change();
                            $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
                        }
                    }
                    if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                    else {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                }
                else {

                    if (hasValue($scope.allergiesEditMode) && $scope.allergiesEditMode == true) {
                        $scope.OK();//on success save close in edit mode
                    }
                    else if (IsPopupClose == true) {
                        if (hasValue($scope.allergiesForPatientFreeText)) {
                            $scope.AlergiesFreeTextSaving(IsPopupClose);
                        }
                        else {
                            $scope.OK();
                        }
                    }
                    else {
                        if (hasValue($scope.allergiesForPatientFreeText)) {
                            $scope.AlergiesFreeTextSaving();
                        }
                        // $scope.OK();//on success save close
                        ShowSuccessMessage("Allergies Information saved Successfully.");
                        $scope.allergiesAddEditSaveAllergiesInformationClick = true;
                        $scope.allergisforPatientCancelButtonText = "Close";
                        $scope.allergiesAddEditAllergiesOrganType = "0";
                        $scope.allergiesAddEditAllergiesSeverityType = 0;
                        $scope.allergiesAddEditTypeFreeTextManifestations = "";
                        //$scope.allergiesAddEditAllergiesDrugType = "4";
                        //  $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
                        //$scope.allergiesAddEditAllergiesDrugType = $scope.AllergenTypeID;
                        $scope.allergiesAllergenddlOptions.change();
                        $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
                    }

                    if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Updated Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.CHANGE, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                    else {
                        EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documented Allergies Details for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.EMRDataFromPopup.PatientID, EMRPracticeModel.LoggedUserID);
                    }
                }

            });


        }



    };
    //################### SAVE ALLERGY INFO BLOCK END #########################


    //################### CHANGE TEXT BASED ON ALLERGIAN TYPE BLOCK START  #########################
    //*******PURPOSE: this method is useful in saving the NO  known allergies info
    //*******CREATED BY:  Hemanth U
    //*******CREATED DATE: 10/27/2015
    $scope.allergiesaddEditChangeAllergenType = function () {

        $scope.allergiesNKDAButtonShowStatus = false;
        $scope.allergiesNKFAButtonShowStatus = false;
        $scope.allergiesNKEAButtonShowStatus = false;
        $scope.allergiesNKOAButtonShowStatus = false;

        //if (hasValue($scope.EMRDataFromPopup.CurrentAllergiesList) && $scope.EMRDataFromPopup.CurrentAllergiesList.length > 0) {
        //    //var AllergiesRelatedToNoKnownStatus = $.grep($scope.EMRDataFromPopup.CurrentAllergiesList, function (element, index) {
        //    //    return element.DrugID == "999999" && (element.Allergen_TypeName == "NKDA" || element.Allergen_TypeName == "NKFA" || element.Allergen_TypeName == "NKEA" || element.Allergen_TypeName == "NKOA"); // retain appropriate elements
        //    //});

        //    //if (hasValue(AllergiesRelatedToNoKnownStatus) && AllergiesRelatedToNoKnownStatus.length > 0) {
        //    angular.forEach($scope.EMRDataFromPopup.CurrentAllergiesList, function (item, index) {
        //        if (item.DrugID == "999999" && item.Allergen_TypeName == "NKDA")
        //            $scope.allergiesNKDAButtonShowStatus = false;
        //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKFA")
        //            $scope.allergiesNKFAButtonShowStatus = false;
        //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKEA")
        //            $scope.allergiesNKEAButtonShowStatus = false;
        //        else if (item.DrugID == "999999" && item.Allergen_TypeName == "NKOA")
        //            $scope.allergiesNKOAButtonShowStatus = false;
        //    });

        //    //}

        //}

        //if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownDrugAllergies) {//
        //    // $scope.allergiesAddEditpageNoKnownAllergiestext = "No Known Drug Allergies";
        //    $scope.allergiesAddEditpageNoKnownAllergiestext = "NKDA";
        //    $scope.allergiesAddEditDetailNameTitle = "No Known Drug Allergy";

        //    $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = $scope.allergiesNKDAButtonShowStatus;

        //}
        //else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownFoodAllergies) {
        //    //$scope.allergiesAddEditpageNoKnownAllergiestext = "No Known Food Allergies";
        //    $scope.allergiesAddEditpageNoKnownAllergiestext = "NKFA";
        //    $scope.allergiesAddEditDetailNameTitle = "No Known Food Allergy";

        //    $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = $scope.allergiesNKFAButtonShowStatus;

        //}
        //else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownEnvironmentalAllergies) {
        //    //$scope.allergiesAddEditpageNoKnownAllergiestext = "No Known Environmental Allergies";
        //    $scope.allergiesAddEditpageNoKnownAllergiestext = "NKEA";
        //    $scope.allergiesAddEditDetailNameTitle = "No Known Environmental Allergy";

        //    $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = $scope.allergiesNKEAButtonShowStatus;

        //}
        //else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownVaccinesAllergies) {
        //    //$scope.allergiesAddEditpageNoKnownAllergiestext = "No Known Vaccine Allergies";
        //    $scope.allergiesAddEditpageNoKnownAllergiestext = "NKVA";
        //    $scope.allergiesAddEditDetailNameTitle = "No Known Vaccine Allergy";

        //}
        //else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownOtherAllergies) {
        //    //$scope.allergiesAddEditpageNoKnownAllergiestext = "No Known Other Allergies";
        //    $scope.allergiesAddEditpageNoKnownAllergiestext = "NKOA";
        //    $scope.allergiesAddEditDetailNameTitle = "No Known Other Allergy";

        //    $scope.allergiesAddEditpageNoKnownAllergiesButtonShowHide = $scope.allergiesNKOAButtonShowStatus;

        //}
    }
    //################### CHANGE TEXT BASED ON ALLERGIAN TYPE BLOCK END #########################


    //################### NO KNOWN ALLEGIAN TYPE BUTTON CLICK EVENT  BLOCK START  #########################
    //*******PURPOSE: this method is useful in saving the NO  known allergies info
    //*******CREATED BY:  Hemanth U
    //*******CREATED DATE: 10/27/2015
    $scope.allergiesAddEditAllergicNoKnownAllergiesClick = function (confirmation) {

        var allergiesmoreinfomodelList = [];
        var allergiesmoreinfomodel = {};
        //only when confirmation not having any value
        if (!hasValue(confirmation)) {

            if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownDrugAllergies) {
                allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownDrugAllergies;
                allergiesmoreinfomodel.AllergyInformation = "No known Drug Allergies";

            }
            else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownFoodAllergies) {
                allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownFoodAllergies;
                allergiesmoreinfomodel.AllergyInformation = "No known Food Allergies";

            }
            else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownEnvironmentalAllergies) {
                allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownEnvironmentalAllergies;
                allergiesmoreinfomodel.AllergyInformation = "No known Environmental Allergies";

            }
            else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownVaccinesAllergies) {
                allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownVaccinesAllergies;
                allergiesmoreinfomodel.AllergyInformation = "No known Vaccine Allergies";

            }
            else if ($scope.allergiesAddEditAllergiesDrugType == noKnownAllergiesInformation.noKnownOtherAllergies) {
                allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownOtherAllergies;
                allergiesmoreinfomodel.AllergyInformation = "No known Other Allergies";

            }

            allergiesmoreinfomodel.AllergyInfo = "";
            allergiesmoreinfomodelList.push(allergiesmoreinfomodel); //Assing model to list 
            $scope.allergiesNoKnownAllergiesSelectedAllergies = allergiesmoreinfomodelList;   //Assign the data to scope variable 
        }

        //If the length is zero then maintain the same state this is when click on no in confirmation window
        if (!hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) || $scope.allergiesNoKnownAllergiesSelectedAllergies.length <= 0) return;

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentID,
            allergiesmoreinfomodelList: $scope.allergiesNoKnownAllergiesSelectedAllergies,
            AllergyNKDAandASKDStatusType: 2,//for no known            
        };

        if (hasValue(confirmation)) {
            postData.IsConfirmationRequired = false;
        }
        //Save serivce call to save the no known allergies
        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false; //If error in service response then return
            if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                $scope.allergiesNoKnownAllergiesConfirmationsList = serviceResponse.confirmationModelList; //Assign the confirmations model list
                $scope.allergiesAddEditallergiesNoknownAllergiesShowConfirmations(0);//sending 0 as init to start the confirmations
            }
            else {
                $scope.OK();//closing the popup
            }
        });

    }
    //################### NO KNOWN ALLEGIAN TYPE BUTTON CLICK EVENT  BLOCK end  #########################

    //################### NO KNOWN ALLEGIAN TYPE BUTTON CLICK EVENT  BLOCK START  #########################
    //*******PURPOSE: this method is useful in saving the NO  known allergies info
    //*******CREATED BY:  Hemanth U
    //*******CREATED DATE: 10/27/2015r
    $scope.allergiesAddEditAllergicOnlyNoKnownAllergiesClick = function () {

        var allergiesmoreinfomodelList = [];
        var allergiesmoreinfomodel = {};

        allergiesmoreinfomodel.AllergyInfoID = noKnownAllergiesInformation.noKnownAllergies;
        allergiesmoreinfomodel.AllergyInformation = "No known Allergies";
        allergiesmoreinfomodel.AllergyInfo = "";
        allergiesmoreinfomodelList.push(allergiesmoreinfomodel); //Assing model to list 
        $scope.allergiesNoKnownAllergiesSelectedAllergies = allergiesmoreinfomodelList;   //Assign the data to scope variable 

        //If the length is zero then maintain the same state this is when click on no in confirmation window
        if (!hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) || $scope.allergiesNoKnownAllergiesSelectedAllergies.length <= 0) return;

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentID,
            allergiesmoreinfomodelList: $scope.allergiesNoKnownAllergiesSelectedAllergies,
            AllergyNKDAandASKDStatusType: 2,//for no known            
        };

        //if (hasValue(confirmation)) {
        postData.IsConfirmationRequired = false;
        //}
        //Save serivce call to save the no known allergies
        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false; //If error in service response then return
            if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                $scope.allergiesNoKnownAllergiesConfirmationsList = serviceResponse.confirmationModelList; //Assign the confirmations model list
                $scope.allergiesAddEditallergiesNoknownAllergiesShowConfirmations(0);//sending 0 as init to start the confirmations
            }
            else {
                ///////WHEN NO ALLERGIES ARE LINKED TO THE PATIENT THEN WE OPEN NO KNOW ALLERGIES POPUP FOR USER SELECTION
                //////THIS CHANGE IS DONE THE ADD ALLERGIES WINDOW
                //////THIS CHANGE IS EFFECTED FROM PATIENT SUMMARY AND EASY FORMS NAVIGATIONS
                $scope.allergiesAddEditAllergicOnlyNoKnownAllergies1Click();
                ////  $scope.OK();//closing the popup
            }
        });

    }
    //################### NO KNOWN ALLEGIAN TYPE BUTTON CLICK EVENT  BLOCK end  #########################


    //################### NO KNOWN Allergies TYPE CONFIRMATION BLOCK START  #########################
    //*******PURPOSE: this method is useful in saving the NO  known allergies info
    //*******CREATED BY:  Hemanth U
    //*******CREATED DATE: 10/27/2015
    $scope.allergiesAddEditallergiesNoknownAllergiesShowConfirmations = function (confirmationListIndex) {
        //Verify the Confirmations list having the value then show the confirmation otherwise Save the data
        if ($scope.allergiesNoKnownAllergiesConfirmationsList[confirmationListIndex] != undefined) {

            var item = $scope.allergiesNoKnownAllergiesConfirmationsList[confirmationListIndex];  //Assign the confirmation type and confirmation message to variable
            //Show the confirmation popup
            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), item.ConformationMessage, 'md').then(function (result) {
                if (result == "NO") {

                    if (item.ConfirmationType == 1) {
                        return;
                    }
                    else {

                        //Verify the selected button click with allergy info id is compare with confirmation type if both are same then remove the selected item from the model
                        if (hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) && $scope.allergiesNoKnownAllergiesSelectedAllergies[0].AllergyInfoID == item.ConfirmationType) {
                            $scope.allergiesNoKnownAllergiesSelectedAllergies.splice(0, 1);//removing the item when no comment is inserted

                        }

                        $scope.allergiesAddEditAllergicNoKnownAllergiesClick(1);//calling the save 
                    }
                }
                else if (result == "YES") {
                    //If the confirmation type is not equal to 1 then show the popup to select reason to remove the Allergy
                    if (item.ConfirmationType != 1) {
                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/300'*/GetEMRPageURLByIndex(300), item, 'md').then(function (result) {
                            if (hasValue(result)) {

                                //Verify the selected button click with allergy info id is compare with confirmation type if both are same then add selected reason as Allergy info the selected item 
                                if (hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) && $scope.allergiesNoKnownAllergiesSelectedAllergies[0].AllergyInfoID == item.ConfirmationType) {
                                    $scope.allergiesNoKnownAllergiesSelectedAllergies[0].AllergyInfo = result;//setting the comment                

                                }
                            }
                            //No reason is selected then show the same window
                            else {

                                if (hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) && $scope.allergiesNoKnownAllergiesSelectedAllergies[0].AllergyInfoID == item.ConfirmationType) {
                                    $scope.allergiesNoKnownAllergiesSelectedAllergies.splice(0, 1);//removing the item when no comment is inserted

                                }
                            }
                            $scope.allergiesAddEditAllergicNoKnownAllergiesClick(1);//calling the save 
                        });
                    }
                    else {
                        $scope.allergiesAddEditAllergicNoKnownAllergiesClick(50);//calling the save 
                    }
                }
            });
        }

    };
    //################### NO KNOWN Allergies TYPE CONFIRMATION BLOCK END  #########################



    //$scope.allergiesAddEditAllergicCloseClick = function () {
    //    if ($scope.allergiesAddEditSaveAllergiesInformationClick == true) {
    //        $scope.OK();//if Save plus click then refresh the list in main window
    //    }
    //    else {
    //        $scope.Cancel();
    //    }
    //}

    $scope.allergiesAddEditAllergicCancelClick = function () {
        if ($scope.allergiesAddEditSaveAllergiesInformationClick == true) {
            $scope.OK();//if Save plus click then refresh the list in main window
        }
        else {
            if (hasValue($scope.EMRDataFromPopup) && hasValue($scope.EMRDataFromPopup.isFromEasyForms) && $scope.EMRDataFromPopup.isFromEasyForms == true) {
                $scope.OK('cancel');
            }
            else {
                $scope.Cancel();
            }
        }
    }

    //CLEAR DATA BUTTON CLICK EVENT TO CLEAR THE DATA IN THE EASYFORM FIELD
    $scope.allergiesAddEditClearDataClick = function () {
        $scope.OK("1");
    }

    $scope.allergiesForPatientAddOrDeleteFromCommonListClickEvent = function (IsAddOrDeleteFromCommonListEvent) {
        if (!hasValue($scope.selectedDrug)) return false;
        var postData = {
            DrugID: $scope.selectedDrug.DrugID,
        }
        if (IsAddOrDeleteFromCommonListEvent == 1) {
            postData.IsCommonlyUsed = true;
        }
        else {
            postData.IsCommonlyUsed = false;
        }
        //Save serivce call to save the no known allergies
        AllergiesService.allergiesUpdatePatientFoodAllergiesCommonlyUsedInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false; //If error in service response then return
            $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
        });
    }

    // CHANGED BY AKBAR AS THIS METHOD TAKING TOO LONG TO STATE MAINTAIN MANIFESTATIONS DATA
    $scope.allergiesAddEditAutoSelectLinkedManifestationsBasedOnAllergenID_Old = function () {
        if (hasValue($scope.allergiesAddEditLinkedAllergiesListForPatient)) {
            angular.forEach($scope.allergiesAddEditLinkedAllergiesListForPatient, function (item) {
                if ($scope.allergiesAddEditAllergiesDrugType == item.Allergen_TypeID) {
                    if ($scope.allergiesAddEditAllergiesDrugType != 5) {
                        var Allergengrid = $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid;
                        $.each(Allergengrid.tbody.find('tr'), function () {
                            var model = Allergengrid.dataItem(Allergengrid.select());
                            if (model.DrugID == item.AllergyDetailsID) {
                                var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                                var PreviousSelectedMenifestationIds = item.MenifestationIDs;
                                var prevMenifestationsIds = new Array();//building the array of the menifestaions iD's
                                prevMenifestationsIds = PreviousSelectedMenifestationIds.split(",");//splitting the comma space separated string into array of strings
                                angular.forEach(prevMenifestationsIds, function (item) {
                                    var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                                    $.each(grid.tbody.find('tr'), function () {
                                        var model = grid.dataItem(this);
                                        if (model.AllergiesManifestationsUserAddedId == parseInt(item)) {
                                            model.selected = true;
                                        }
                                    });
                                });
                            }
                            else {

                                var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                                $.each(grid.tbody.find('tr'), function () {
                                    var model = grid.dataItem(this);
                                    if (model.selected) {
                                        model.selected = false;
                                    }
                                });
                                // $scope.allergiesAddEditGetManifestationList();
                            }
                        });
                    }
                    else {
                        var AllergenVaccinesgrid = $scope.allergiesAddEditWidgets.allergiesAddEditVaccinesGrid;

                        //var model = AllergenVaccinesgrid.dataItem(AllergenVaccinesgrid.select());
                        var SelectedRowsinVaccinesGrid = getSelectedRowsFromGrid(AllergenVaccinesgrid);
                        if (hasValue(SelectedRowsinVaccinesGrid)) {
                            angular.forEach(SelectedRowsinVaccinesGrid, function (itemsinVaccinesGrid) {
                                if (itemsinVaccinesGrid.DrugID == item.AllergyDetailsID) {
                                    var PreviousSelectedMenifestationIds = item.MenifestationIDs;
                                    var prevMenifestationsIds = new Array();//building the array of the menifestaions iD's
                                    prevMenifestationsIds = PreviousSelectedMenifestationIds.split(",");//splitting the comma space separated string into array of strings
                                    angular.forEach(prevMenifestationsIds, function (item) {
                                        var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                                        $.each(grid.tbody.find('tr'), function () {
                                            var model = grid.dataItem(this);
                                            if (model.AllergiesManifestationsUserAddedId == parseInt(item)) {
                                                model.selected = true;
                                            }
                                        });
                                    });
                                }

                            });
                        }

                        if (!hasValue(SelectedRowsinVaccinesGrid)) {
                            var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                            $.each(grid.tbody.find('tr'), function () {
                                var model = grid.dataItem(this);
                                if (model.selected) {
                                    model.selected = false;
                                }
                            });
                        }


                    }
                }
            });
        }
    }

    // ######################### STATE MAINTAIN MANIFESTATIONS DATA WHEN USER SELECTES ALLERGIES ########################
    // PURPOSE: THIS METHOD IS USED TO STATE MAINTAIN MANIFESTATIONS DATA WHEN USER SELECTES ALLERGIES
    // CREATED BY: AKBAR
    // CREATED ON: 04/01/2020
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesAddEditAutoSelectLinkedManifestationsBasedOnAllergenID = function (UserSelectedDrugInfo) {
        // VERIFYING WETHER THE MANIFESTATIONS DATA. IF THERE IS NO DATA THEN NO NEED OF STATE MAINTAIN THE DATA IN GRID
        if (hasValue($scope.allergiesAddEditWidgets) && hasValue($scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid)) {
            // VARIABLE IS USED TO STORE MANIFESTATIONS DATA OBJECT
            var manifestationsGrid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;

            // HERE 5 MEANS THE ALLERGY TYPE IS NOT VACCINE AND USER HAVE SELECETD THE DRUG INFO
            if ($scope.allergiesAddEditAllergiesDrugType != 5 && hasValue(UserSelectedDrugInfo)) {

                // VERIFYING WETHER THE SELECETED DRUG IS ALREADY SAVED OR NOT 
                var UserSelectedAllergyInfoFromSummaryPage = $scope.allergiesAddEditLinkedAllergiesListForPatient.filter(function (eachAllergyInfo) {
                    return eachAllergyInfo.Allergen_TypeID == $scope.allergiesAddEditAllergiesDrugType &&
                        UserSelectedDrugInfo.DrugID == eachAllergyInfo.AllergyDetailsID
                });

                // IF THE DRUG IS SELECTED AND HAVE MANIFESTATIONS INFO THEN STATEMAINTAIING 
                // OR ELSE CLEARING THE STATE MAINTAIN DATA 
                if (hasValue(UserSelectedAllergyInfoFromSummaryPage) && UserSelectedAllergyInfoFromSummaryPage.length > 0 &&
                    hasValue(UserSelectedAllergyInfoFromSummaryPage[0]) && hasValue(UserSelectedAllergyInfoFromSummaryPage[0].MenifestationIDs)) {

                    // SPLITING MANIFESTATIONS DATA ALREADY SAVED SO THAT WE CAN SAVE IN ARRAY
                    var prevMenifestationsIds = UserSelectedAllergyInfoFromSummaryPage[0].MenifestationIDs.split(",");

                    // AS WE REQUIRE ID AS INTEGERS MAKING ALL THE ITEMS IN GRID AS INTEGERS
                    prevMenifestationsIds = prevMenifestationsIds.map(function (eachMenifestationsId) { return parseInt(eachMenifestationsId) });

                    // LOOPING ACROSS MANIFESTATIONS DATA TO STATE MAINTAIN DATA
                    $.each(manifestationsGrid.tbody.find('tr'), function () {
                        // GET THE DATA ITEM OF ANIFESTATION
                        var eachManifestation = manifestationsGrid.dataItem(this);
                        // IF MANIFESTATION IS ALREADY SAVED FOR USER THEN SELECTING THE MANIFESTATION DATA
                        if (prevMenifestationsIds.includes(eachManifestation.AllergiesManifestationsUserAddedId)) {
                            eachManifestation.selected = true;
                        } else {
                            eachManifestation.selected = false;
                        }
                    });

                } else {
                    // CLEARLY PREVIOUSLY STATE MAINTAIN MANIFESTATIONS DATA
                    $scope.allergiesAddEditUnCheckAllManifestations();
                }
            }
            // THIS ELSE BLOCK IS UNTOUCHED AS IT IS COMMENTED IN C# 
            // THIS CODE WILLL NEVER BE EXCUTED
            // BUT AS PER SRINIVAS SIR JUST LEFT OVER FOR SAFETY PURPOSE
            else {
                if (hasValue($scope.allergiesAddEditLinkedAllergiesListForPatient)) {
                    angular.forEach($scope.allergiesAddEditLinkedAllergiesListForPatient, function (item) {
                        if ($scope.allergiesAddEditAllergiesDrugType == item.Allergen_TypeID) {
                            var AllergenVaccinesgrid = $scope.allergiesAddEditWidgets.allergiesAddEditVaccinesGrid;
                            //var model = AllergenVaccinesgrid.dataItem(AllergenVaccinesgrid.select());
                            var SelectedRowsinVaccinesGrid = getSelectedRowsFromGrid(AllergenVaccinesgrid);
                            if (hasValue(SelectedRowsinVaccinesGrid)) {
                                angular.forEach(SelectedRowsinVaccinesGrid, function (itemsinVaccinesGrid) {
                                    if (itemsinVaccinesGrid.DrugID == item.AllergyDetailsID) {
                                        var PreviousSelectedMenifestationIds = item.MenifestationIDs;
                                        var prevMenifestationsIds = new Array();//building the array of the menifestaions iD's
                                        prevMenifestationsIds = PreviousSelectedMenifestationIds.split(",");//splitting the comma space separated string into array of strings
                                        angular.forEach(prevMenifestationsIds, function (item) {
                                            var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
                                            $.each(grid.tbody.find('tr'), function () {
                                                var model = grid.dataItem(this);
                                                if (model.AllergiesManifestationsUserAddedId == parseInt(item)) {
                                                    model.selected = true;
                                                }
                                            });
                                        });
                                    }

                                });
                            } else {
                                // CLEARLY PREVIOUSLY STATE MAINTAIN MANIFESTATIONS DATA
                                $scope.allergiesAddEditUnCheckAllManifestations();
                            }
                        }
                    });
                }
            }
        }
    }
    // ######################### STATE MAINTAIN MANIFESTATIONS DATA WHEN USER SELECTES ALLERGIES ########################


    // ######################### CLEARLY PREVIOUSLY STATE MAINTAIN MANIFESTATIONS DATA ########################
    // CREATED BY: AKBAR
    // CREATED ON: 04/01/2020
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesAddEditUnCheckAllManifestations = function () {
        // VERIFYING WETHER THE MANIFESTATIONS DATA. IF THERE IS NO DATA THEN NO NEED OF UNCHECKING THE DATA IN GRID
        if (hasValue($scope.allergiesAddEditWidgets) && hasValue($scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid)) {
            var grid = $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid;
            // LOOPING ACROSS MANIFESTATIONS DATA TO CLEAR ALL THE STATE MAINTAIN DATA
            $.each(grid.tbody.find('tr'), function () {
                // GET THE DATA ITEM OF ANIFESTATION
                var model = grid.dataItem(this);
                // IF SELECTED THEN UNCHECKING THE MANIFESTATION DATA
                if (model.selected) {
                    model.selected = false;
                }
            });
        }
    }
    // ######################### CLEARLY PREVIOUSLY STATE MAINTAIN MANIFESTATIONS DATA ########################


    //GO BUTTON CLICK EVENT FOR SEARCH ALLERGIES
    $scope.allergiesForPatientSearchAllergenGOClick = function () {
        $scope.txtSearchDrugFocus = true;
        $scope.allergiesAddEditGetTheDrugListBasedOnSearch();
    }

    //GO BUTTON CLICK EVENT FOR SEARCH MANIFESTATIONS
    $scope.allergiesForPatientSearchManifestationGOClick = function () {
        $scope.txtSearcManifestation = true;
        $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
    }

    //###################  THIS METHOD IS USED FOR GO BUTTON CLICK EVENT FOR SEARCH ALLERGIES IN EDIT MODE BLOCK START #########################
    //*******PURPOSE:THIS METHOD IS USED FOR GO BUTTON CLICK EVENT FOR SEARCH ALLERGIES IN EDIT MODE
    //*******CREATED BY: SIVANNARAYANA M
    //*******CREATED DATE: 26TH DEC 2018
    //

    $scope.allergiesAddEditSearchManifestationList = function () {

        //This flag is used to perform when search operation performed 
        $scope.isFromEditManifestationSearch = true;
        $scope.allergiesAddEditGetTheManifestationListBasedOnSearch();
    }


    //###################  THIS METHOD IS USED FOR GO BUTTON CLICK EVENT FOR SEARCH ALLERGIES IN EDIT MODE BLOCK END #########################





    //###################  DETAIL AND BRIEF VIEW BLOCK START #########################
    //*******PURPOSE: this method is useful for detail and brief view.
    //*******CREATED BY: Rama M
    //*******CREATED DATE: 03/16/2016
    $scope.allergiesAddEditBriefAndDetailViewClick = function () {

        if (hasValue($scope.allergiesAddEditSearchSnomedCode)) {
            $scope.allergiesAddEditSearchSnomedCode = "";
        }

        if (hasValue($scope.allergiesAddEditDropdown) && $scope.allergiesAddEditDropdown != 0) {
            $scope.allergiesAddEditDropdown = 0;
        }

        if ($scope.allergiesAddEditBriefAndDetailIconClickEvent == true) {
            $scope.allergiesAddEditDetailBriefTitle = "Brief View";
            $("#btnAllergiesAddEditBriefAndDetailIcon_" + $scope.allergiesAddEditGUID).removeClass("DetailIcon").addClass("BriefIcon");
            $scope.allergiesAddEditDrugsGridHeightClass = "allergiesDrugsGridInDetail";
            $scope.allergiesForPatientAddEditSearchWidthClass = "colReq-sm-6 col-xs-4 AllergiesAddEditSearchWidthInDetailView";
            $scope.allergiesForPatientAddEditOrganTypeClass = "colReq-sm-3 col-xs-4";
            //$scope.allergiesAddEditSearchShowInDetailView = true;
            $scope.allergiesAddEditSearchShowInDetailViewTextBox = true;
            $scope.allergiesAddEditDropDownWidthClass = "col-md-2 colReq-sm-2 col-xs-4 AllergiesAddEditDropDownWidthInDetailView";
            $scope.allergiesAddEditSearchSnomedWidthClass = "colReq-sm-4 col-xs-4 AllergiesAddEditSnomedWidthInDetail";

            //setTimeout(function () {
            $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid.showColumn("RxNormCode");
            $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid.showColumn("SNOMEDCode");
            $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid.showColumn("ManifestationCodeStatus");
            //});
            $scope.allergiesAddEditBriefAndDetailIconClickEvent = false;
        }
        else {
            $scope.allergiesAddEditDetailBriefTitle = "Detail View";
            $("#btnAllergiesAddEditBriefAndDetailIcon_" + $scope.allergiesAddEditGUID).removeClass("BriefIcon").addClass("DetailIcon");
            //setTimeout(function () {

            //});
            $scope.allergiesForPatientAddEditSearchWidthClass = "colReq-sm-6 col-xs-4";
            $scope.allergiesForPatientAddEditOrganTypeClass = "colReq-sm-4 col-xs-4";
            $scope.allergiesAddEditSearchSnomedWidthClass = "colReq-sm-4 col-xs-4";
            $scope.allergiesAddEditDropDownWidthClass = "col-md-2 colReq-sm-2 col-xs-4";

            //$scope.allergiesAddEditSearchShowInDetailView = false;
            $scope.allergiesAddEditSearchShowInDetailViewTextBox = false;
            $scope.allergiesAddEditDrugsGridHeightClass = "allergiesDrugsGrid gridWith5rows_sm";

            $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid.hideColumn("RxNormCode");
            $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid.hideColumn("SNOMEDCode");
            $scope.allergiesAddEditWidgets.allergiesAddEditManifestationsGrid.hideColumn("ManifestationCodeStatus");

            $scope.allergiesAddEditBriefAndDetailIconClickEvent = true;

        }
    }
    //###################  DETAIL AND BRIEF VIEW BLOCK END #########################



    //######### DATA FOR  DROPDOWN BLOCK START #############
    ///*******PURPOSE: THIS IS USED TO PROVIDE  DATA FOR  DROPDOWN 
    ///*******CREATED BY: Rama M
    ///*******CREATED DATE:10/24/2017
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesAddEditDropdownInfo = [
        { "AllergiesAddEditDropdownOption": "All", "AllergiesAddEditDropdownOptionId": "0" },
        { "AllergiesAddEditDropdownOption": "User Added", "AllergiesAddEditDropdownOptionId": "1" },
        { "AllergiesAddEditDropdownOption": "System Defined", "AllergiesAddEditDropdownOptionId": "2" },
    ]

    //BIND THE DATA TO THE DROPDOWN DATASOURCE
    $scope.allergiesAddEditDropdownDataSource = new kendo.data.DataSource({
        data: $scope.allergiesAddEditDropdownInfo,//ASSIGNING NULL ON DEFAULT       
    });
    //######### DATA FOR DROPDOWN BLOCK END #############

    //#########  DROPDOWN DATABOUND BLOCK START #############
    ///*******PURPOSE: THIS IS USED TO DROPDOWN DATABOUND
    ///*******CREATED BY: Rama M
    ///*******CREATED DATE:10/24/2017
    ///*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; *************************
    $scope.allergiesAddEditDropDownOnDataBound = function (e) {

        if (!$("#ddlAllergiesAddEditDropdown_" + $scope.allergiesAddEditGUID + "-list").hasClass("allergiesAddEditDroDownWidthClass"))
            $("#ddlAllergiesAddEditDropdown_" + $scope.allergiesAddEditGUID + "-list").addClass("allergiesAddEditDroDownWidthClass");

    };
    //#########  DROPDOWN DATABOUND BLOCK END #############

    //################### GET ALLERGIES DRUGS  ALL DRUGS LIST BLOCK START #########################
    //*******PURPOSE: This method is useful in getting All drugs list 
    //*******CREATED BY:  PRAVEEN ARISETTY
    //*******CREATED DATE: 05/03/2018    
    $scope.allergiesAddEditGetAllDrugsList = function () {

        var serviceData = {
            SearchString: EMRStringSeperator,
            AllergenType: $scope.allergiesAddEditAllergiesDrugType,
            SearchMode: 2//any part-2,1-starts with
        };

        $scope.allergiesAddEditDrugsGridDataList = [];  //clearing the previous list
        AllergiesService.allergiesGetAllergyDrugsCommonlyUsedList(serviceData).then(function (serviceResponse) {        //calling allergiesGetAllergyDrugsCommonlyUsedList service

            if (isError(serviceResponse)) return false;
            if (!hasValue(serviceResponse) || serviceResponse.length == 0) return false;

            $scope.allergiesAddEditDrugsGridDataList = serviceResponse;

            $scope.allergiesAddEditAllergiesDrugType = 999;             //999 - ALL DRUGS LIST
            var serviceData = {
                SearchString: "",
                AllergenType: 999,
                SearchMode: 2//any part-2,1-starts with
            };
            AllergiesService.allergiesGetAllergyDrugsList(serviceData).then(function (result) {
                if (isError(result)) return false;
                if (!hasValue(result) || result.length == 0) return false;
                for (var dataCount = 0; dataCount < result.length; dataCount++) {  //Append Values To List 

                    $scope.allergiesAddEditDrugsGridDataList.push(result[dataCount]);
                }

                var pageSizeForGrid;
                var allergiesAllergenGrid;
                if ($scope.allergiesAddEditDrugsGridDataList.length > 100) {
                    pageSizeForGrid = 60;//if the no.of records are huge
                }
                else {
                    pageSizeForGrid = $scope.allergiesAddEditDrugsGridDataList.length;
                }

                var newDataSource = new kendo.data.DataSource({   //Bind List Values To Grid
                    data: $scope.allergiesAddEditDrugsGridDataList,
                    serverPaging: false,//lazy binding
                    serverSorting: false,//lazy binding
                    serverFiltering: false,//lazy binding
                    pageSize: pageSizeForGrid,
                    batch: true
                });
                allergiesAllergenGrid = $scope.allergiesAddEditWidgets.allergiesAddEditDrugsGrid;
                if (!hasValue(allergiesAllergenGrid)) {
                    $scope.allergiesAddEditDrugsGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source
                    return false;
                }
                newDataSource.read();//reading the data source for assigning it to the dgrid
                allergiesAllergenGrid.setDataSource(newDataSource);//setting the new data source every time    
                //   $scope.allergiesAddEditDrugsGridOptions.dataSource.data(serviceResponse);//refreshing the grid data source   
                $scope.allergySavingModel.Allergen_IDs = "";//after succesfull search clearing the previously selected allergen iD
            });
        });

    };
    //################### GET ALLERGIES DRUGS  COMMONLY USED DRUGS LIST BLOCK END #########################




    //################### ALLERGIES NO KNOWN  ALLERGIES  BLOCK START #########################
    //*******PURPOSE: this method is useful in setting the no known allergies for the selected patient
    //*******CREATED BY: Rama M
    //*******CREATED DATE: 04/26/2018

    $scope.allergiesAddEditAllergicOnlyNoKnownAllergies1Click = function () {

        //checking whether data is mot null
        if (!hasValue($scope.EMRDataFromPopup) || !hasValue($scope.EMRDataFromPopup.PatientID) || $scope.EMRDataFromPopup.PatientID < 0) {
            return false;
        }
        //declaring an object to pass patient details to popup
        var DatatoPopup = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentId: $scope.EMRDataFromPopup.AppointmentId,
            //value from dropdown
            AllergenType: $scope.allergiesAddEditAllergiesDrugType,
        }
        //to display modal popup
        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/296'*/GetEMRPageURLByIndex(296), DatatoPopup, 'lsm').then(function (result) {
            //if result is cancel then to close this modalpopup 
            if (!hasValue(result) || result == "cancel") return false;
            //if result is ok then to close modalpopup as well as main window
            if (hasValue($scope.allergiesForPatientFreeText)) {
                $scope.AlergiesFreeTextSaving(true);
            }
            else {
                $scope.OK();
            }
        });

    };

    //This Method is used to Store the Free Text in allergie service
    $scope.AlergiesFreeTextSaving = function (IsPopupClose) {
        var postData = {};

        postData.AllergiesFreeText = $scope.allergiesForPatientFreeText;

        if (hasValue($scope.EMRDataFromPopup) && $scope.EMRDataFromPopup.AppointmentId > 0) {
            postData.AppointmentID = $scope.EMRDataFromPopup.AppointmentId;
        }
        if (hasValue($scope.EMRDataFromPopup) && $scope.EMRDataFromPopup.PatientID > 0) {
            postData.PatientID = $scope.EMRDataFromPopup.PatientID;
        }
        postData.Allergen_TypeID = 0;

        //PatientID: $scope.allergiesFreeTextAddEditPatientInfo.PatientID,
        //AllergyDetailsID: $scope.allergiesFreeTextAddEditParentData.AllergyDetailsID,

        // AppointmentID: $scope.allergiesFreeTextAddEditPatientInfo.AppointmentId,
        // Allergen_TypeID: 0 //for free text


        //UPDATING THE ALLERGIES FREE TEXT
        AllergiesService.allergiesSaveorUpdatePatientAllergiesFreeTextInformation(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) {
                $("#txtAllergiesForPatientFreeText_" + $scope.allergiesAddEditGUID).focus();
                return false;
            }
            if (hasValue(IsPopupClose) && IsPopupClose == true) {
                $scope.OK();
            }
            else {
                $scope.allergiesAddEditSaveAllergiesInformationClick = true;
                $scope.allergiesForPatientFreeText = "";
            }
        });
    }


    //################### ALLERGIES NO KNOWN  ALLERGIES  BLOCK END  #########################

    //$scope.allergiesAddEditPageInit();
}]);



