
import { app } from "../../module";
import template from "./index.html";


app.component('allergies-no-known-info', {
    template: template,
    controller: 'AllergiesNoknownAllergiesInfoController'
})

//*******PURPOSE: The purpose of the controller is used to View the Allergies Asked but Unknown Allergies Info
//*******EFFECTIVE FILES: Views/Allergies/..
//*******CREATED BY: Lakshmi B
//*******CREATED DATE: 02/25/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



app.controller('AllergiesNoknownAllergiesInfoController', ["$scope", 'ModalPopupService', 'AllergiesService', function ($scope, ModalPopupService, AllergiesService) {

    this.$onInit = function () {
        $scope.allergiesNoknownAllergiesInfoPageInit();
    }

    $scope.allergiesNoknownAllergiesInfoPageInit = function () {
        $scope.AllergiesNoknownAllergiesInfoWidgets = {};
    };



    //data for grid
    $scope.allergiesNoknownAllergiesInfo = [
              { AllergyInformation: "No known Drug Allergies", AllergyInfoID: 4, AllergyInfo: "" },
              { AllergyInformation: "No known Food Allergies", AllergyInfoID: 2, AllergyInfo: "" },
              { AllergyInformation: "No known Environmental Allergies", AllergyInfoID: 3, AllergyInfo: "" },
              //{ AllergyInformation: "No known Vaccine Allergies", AllergyInfoID: 5, AllergyInfo: "" },
              { AllergyInformation: "No known Other Allergies", AllergyInfoID: 6, AllergyInfo: "" },
    ];



    $scope.allergiesNoknownAllergiesGridDataSource = new kendo.data.DataSource({
        data: $scope.allergiesNoknownAllergiesInfo,//assigning null on default       
    });

    $scope.allergiesNoknownAllergiesGridOptions = {
        dataSource: $scope.allergiesNoknownAllergiesGridDataSource,
        sortable: true,
        navigatable: true,
        mobileRedirect: false,
        selectable: "multiple row",
        showCheckBoxColumn: true,
        columns: [
        {
            field: "AllergyInformation",
            title: "Allergies Info",
        },

        ]
    };

    //on dataBound eent in the grid
    $scope.allergiesNoknownAllergiesGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 28301);
            //#### purpose to show item active in grid according to the dropdown value selected in AddAllergies main window ###//
            //checking whether the Patientid,dropdown value is defined from parent controller and item selected is not all
            if (hasValue($scope.$parent.EMRDataFromPopup) && hasValue($scope.$parent.EMRDataFromPopup.AllergenType) && parseInt($scope.$parent.EMRDataFromPopup.AllergenType) > 0 && $scope.$parent.EMRDataFromPopup.AllergenType != 999) {

                //assigning grid data to variable
                var GridData = $scope.allergiesNoknownAllergiesGridDataSource.data();
                if (!hasValue(GridData) || GridData.length <= 0) {
                    return false;
                }
                //loop to show item active in the grid as per the selected item in the dropdown
                angular.forEach(GridData, function (EachItem) {
                    if (hasValue(EachItem) && hasValue(EachItem.AllergyInfoID)) {
                        if (parseInt($scope.$parent.EMRDataFromPopup.AllergenType) == parseInt(EachItem.AllergyInfoID)) {
                            EachItem.selected = true;
                        }
                    }
                });
            }
                //condition to make all items selected in the grid
            else if (hasValue($scope.$parent.EMRDataFromPopup) && hasValue($scope.$parent.EMRDataFromPopup.AllergenType) && $scope.$parent.EMRDataFromPopup.AllergenType == 999) {
                if (grid.dataSource.data().length > 0) {
                    //assigning grid data to variable
                    var GridData = $scope.allergiesNoknownAllergiesGridDataSource.data();
                    if (!hasValue(GridData) || GridData.length <= 0) {
                        return false;
                    }
                    //if all is selected in the dropdown then to make every item selected in the grid
                    grid.thead.find('.selectAllChkBox').trigger("click");
                    //loop to show item active in the grid as per the selected item in the dropdown
                    angular.forEach(GridData, function (EachItem) {
                        if (hasValue(EachItem)) {
                                EachItem.selected = true;
                        }
                    });
                }
            }
            //end
        }
    };

    //on dataBound eent in the grid
    $scope.allergiesNoknownAllergiesGridOptions.change = function (e) {
        var grid = $scope.AllergiesNoknownAllergiesInfoWidgets.NoknownAllergiesGrid;
        var selectedItem = grid.dataItem(grid.select());
        toggleSelectOnChange(e, selectedItem);
    };



    //this method is useful in saving the allergies asked but unknown infofrmation
    $scope.allergiesNoKnownAllergiesInfoOKClick = function (confirmation) {

        if (!hasValue(confirmation)) {
            $scope.allergiesNoKnownAllergiesSelectedAllergies = getSelectedRowsFromGrid($scope.AllergiesNoknownAllergiesInfoWidgets.NoknownAllergiesGrid);
            if (!hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) && $scope.allergiesNoKnownAllergiesSelectedAllergies.length <= 0) {
                ShowErrorMessage('Please Select No Known Allergy Information.');
                return;
            }
        }

        if (!hasValue($scope.allergiesNoKnownAllergiesSelectedAllergies) || $scope.allergiesNoKnownAllergiesSelectedAllergies.length <= 0) return;

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentId,
            allergiesmoreinfomodelList: $scope.allergiesNoKnownAllergiesSelectedAllergies,
            AllergyNKDAandASKDStatusType: 2,//for no known            
        };

        if (hasValue(confirmation)) {
            postData.IsConfirmationRequired = false;
        }

        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                $scope.allergiesNoKnownAllergiesConfirmationsList = serviceResponse.confirmationModelList;
                //$scope.allergiesNoKnownAllergiesSelectedAllergies = [];//making empty if confrimations has values to send the comments info as selected
                $scope.allergiesNoknownAllergiesShowConfirmations(0);//sending 0 as init to start the confirmations
            }
            else {
                $scope.OK("OK");//closing the popup
            }
        });
    };


    //this method is useful in showing the confirmations that are came back from the service
    $scope.allergiesNoknownAllergiesShowConfirmations = function (confirmationListIndex) {

        if ($scope.allergiesNoKnownAllergiesConfirmationsList[confirmationListIndex] != undefined) {

            var item = $scope.allergiesNoKnownAllergiesConfirmationsList[confirmationListIndex];

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), item.ConformationMessage, 'md').then(function (result) {
                confirmationListIndex = confirmationListIndex + 1;
                if (result == "NO") {

                    if (item.ConfirmationType == 1) {
                        return;
                    }
                    else {
                        var isFound = false;
                        $.each($scope.allergiesNoKnownAllergiesSelectedAllergies, function (index, listItem) {
                            if (hasValue(listItem) && listItem.AllergyInfoID == item.ConfirmationType && !isFound) {
                                $scope.allergiesNoKnownAllergiesSelectedAllergies.splice(index, 1);//removing the item when no comment is inserted
                                isFound = true;
                            }
                        });
                        $scope.allergiesNoknownAllergiesShowConfirmations(confirmationListIndex);//showing the next confirmation
                    }
                }
                else if (result == "YES") {
                    if (item.ConfirmationType != 1) {
                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/300'*/GetEMRPageURLByIndex(300), item, 'md').then(function (result) {
                            if (hasValue(result)) {
                                var isFoundInList = false;
                                $.each($scope.allergiesNoKnownAllergiesSelectedAllergies, function (index, listItem) {
                                    if (listItem.AllergyInfoID == item.ConfirmationType && !isFoundInList) {
                                        $scope.allergiesNoKnownAllergiesSelectedAllergies[index].AllergyInfo = result;//setting the comment                
                                        isFoundInList = true;
                                    }
                                });
                                //$scope.allergiesNoKnownAllergiesSelectedAllergies.push({ AllergyInfo: result, AllergyInfoID: item.ConfirmationType });//pushing the comments as inserted 
                            }
                            else {
                                var isFound = false;
                                $.each($scope.allergiesNoKnownAllergiesSelectedAllergies, function (index, listItem) {
                                    if (hasValue(listItem) && listItem.AllergyInfoID == item.ConfirmationType && !isFound) {
                                        $scope.allergiesNoKnownAllergiesSelectedAllergies.splice(index, 1);//removing the item when no comment is inserted
                                        isFound = true;
                                    }
                                });
                            }
                            $scope.allergiesNoknownAllergiesShowConfirmations(confirmationListIndex);
                        });
                    }
                    else {
                        // $scope.allergiesNoKnownAllergiesSelectedAllergies = getSelectedRowsFromGrid($scope.AllergiesNoknownAllergiesInfoWidgets.NoknownAllergiesGrid);
                        // $scope.allergiesNoKnownAllergiesSelectedAllergies.push({ AllergyInfo: "", AllergyInfoID: item.ConfirmationType });//pushing the comments as inserted
                        $scope.allergiesNoKnownAllergiesInfoOKClick(50);//calling the save 
                    }
                }
            });
        }
        else {
            $scope.allergiesNoKnownAllergiesInfoOKClick(1);//calling the save 
        }
    };




    //$scope.allergiesNoknownAllergiesInfoPageInit();

}]);