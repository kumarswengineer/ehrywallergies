import { app } from "../../module";
import template from "./index.html";

//*******PURPOSE: The purpose of the controller is used to View the Allergies Asked but Unknown Allergies Info
//*******EFFECTIVE FILES: Views/Allergies/..
//*******CREATED BY: Anusha Ch
//*******CREATED DATE: 02/24/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.component('allergies-asked-but-unknown', {
    template: template,
    controller: 'AllergiesAskedbutUnknownAllergiesInfoController'
});


app.controller('AllergiesAskedbutUnknownAllergiesInfoController', ["$scope", 'ModalPopupService', 'AllergiesService', function ($scope, ModalPopupService, AllergiesService) {


    this.$onInit = function () {
        $scope.allergiesAskedbutUnknownAllergiesInfoPageInit();
    }

    //page init method
    $scope.allergiesAskedbutUnknownAllergiesInfoPageInit = function () {

        $scope.allergiesAskedbutUnknownAllergiesWidgets = {};
    };



    //statically assigning the data
    $scope.allergiesAskedbutUnknownAllergiesInfo = [
                  { AllergyInformation: "Asked but Unknown Drug Allergies", AllergyInfoID: 4, AllergyInfo: "" },
                  { AllergyInformation: "Asked but Unknown Food Allergies", AllergyInfoID: 2, AllergyInfo: "" },
                  { AllergyInformation: "Asked but Unknown Environmental Allergies", AllergyInfoID: 3, AllergyInfo: "" },
                  //{ AllergyInformation: "Asked but Unknown Vaccine Allergies", AllergyInfoID: 5, AllergyInfo: "" },
                  { AllergyInformation: "Asked but Unknown Other Allergies", AllergyInfoID: 6, AllergyInfo: "" },
    ];

    $scope.allergiesAskedbutUnknownAllergiesGridDataSource = new kendo.data.DataSource({
        data: $scope.allergiesAskedbutUnknownAllergiesInfo,//assigning null on default       
    });

    $scope.allergiesAskedbutUnknownAllergiesGridOptions = {
        dataSource: $scope.allergiesAskedbutUnknownAllergiesGridDataSource,
        sortable: true,
        navigatable: true,
        selectable: "multiple row",
        mobileRedirect: false,
        showCheckBoxColumn: true,
        columns: [
        {
            field: "AllergyInformation",
            title: "Allergies Info",
        },
        ]
    };

    //on dataBound event in the grid
    $scope.allergiesAskedbutUnknownAllergiesGridOptions.dataBound = function (e) {
        kendoGridEmptyDataTemplate(this, '', '');
        var grid = e.sender;
        if (grid.dataSource.data().length > 0) {
            grid.table.attr("tabindex", 28301);
        }
    };

    //on change event in the grid
    $scope.allergiesAskedbutUnknownAllergiesGridOptions.change = function (e) {
        var grid = $scope.allergiesAskedbutUnknownAllergiesWidgets.AskedbutUnknownAllergiesGrid;
        $scope.allergiesAskedbutUnknownAllergiesSelectedItem = grid.dataItem(grid.select());
        toggleSelectOnChange(e, $scope.allergiesAskedbutUnknownAllergiesSelectedItem);
    };


    //this method is useful in saving the allergies asked but unknown infofrmation
    $scope.allergiesAskedbutUnknownAllergiesInfoOKClick = function (confirmation) {

        if (!hasValue(confirmation)) {
            $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies = getSelectedRowsFromGrid($scope.allergiesAskedbutUnknownAllergiesWidgets.AskedbutUnknownAllergiesGrid);
            if (!hasValue($scope.allergiesAskedButUnknownSelectedUnKnnownAllergies) && $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies.length <= 0) {
                ShowErrorMessage('Please Select Asked but Unknown Allergy Information.');
                return;
            }
        }

        if (!hasValue($scope.allergiesAskedButUnknownSelectedUnKnnownAllergies) || $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies.length <= 0) return;

        var postData = {
            PatientID: $scope.EMRDataFromPopup.PatientID,
            AppointmentID: $scope.EMRDataFromPopup.AppointmentId,
            allergiesmoreinfomodelList: $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies,
            AllergyNKDAandASKDStatusType: 1,//for asked but unnown
        };

        if (hasValue(confirmation)) {
            postData.IsConfirmationRequired = false;
        }

        AllergiesService.allergiesAskedButUnknownAllergiesInfo(postData).then(function (serviceResponse) {
            if (isError(serviceResponse)) return false;
            if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                $scope.allergiesAskedbutUnknownAllergiesConfirmationsList = serviceResponse.confirmationModelList;
                // $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies = [];//making empty if confrimations has values to send the comments info as selected
                $scope.allergiesAskedbutUnknownAllergiesShowConfirmations(0);//sending 0 as init to start the confirmations
            }
            else {
                $scope.OK();//closing the popup
            }
        });
    };


    //this method is useful in showing the confirmations that are came back from the service
    $scope.allergiesAskedbutUnknownAllergiesShowConfirmations = function (confirmationListIndex) {

        if ($scope.allergiesAskedbutUnknownAllergiesConfirmationsList[confirmationListIndex] != undefined) {

            var item = $scope.allergiesAskedbutUnknownAllergiesConfirmationsList[confirmationListIndex];

            ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), item.ConformationMessage, 'md').then(function (result) {
                confirmationListIndex = confirmationListIndex + 1;
                if (result == "NO") {

                    if (item.ConfirmationType == 1) {
                        return;
                    }
                    else {
                        var isFound = false;
                        $.each($scope.allergiesAskedButUnknownSelectedUnKnnownAllergies, function (index, listItem) {
                            if (hasValue(listItem) && listItem.AllergyInfoID == item.ConfirmationType && !isFound) {
                                $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies.splice(index, 1);//removing the item when no comment is inserted
                                isFound = true;
                            }
                        });
                        $scope.allergiesAskedbutUnknownAllergiesShowConfirmations(confirmationListIndex);
                    }
                }
                else if (result == "YES") {
                    if (item.ConfirmationType != 1) {
                        ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/300'*/GetEMRPageURLByIndex(300), item, 'md').then(function (result) {
                            if (hasValue(result)) {
                                var isFoundInList = false;
                                $.each($scope.allergiesAskedButUnknownSelectedUnKnnownAllergies, function (index, listItem) {
                                    if (listItem.AllergyInfoID == item.ConfirmationType && !isFoundInList) {
                                        $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies[index].AllergyInfo = result;//setting the comment                
                                        isFoundInList = true;
                                    }
                                });
                                //$scope.allergiesNoKnownAllergiesSelectedAllergies.push({ AllergyInfo: result, AllergyInfoID: item.ConfirmationType });//pushing the comments as inserted 
                            }
                            else {
                                var isFound = false;
                                $.each($scope.allergiesAskedButUnknownSelectedUnKnnownAllergies, function (index, listItem) {
                                    if (hasValue(listItem) && listItem.AllergyInfoID == item.ConfirmationType && !isFound) {
                                        $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies.splice(index, 1);//removing the item when no comment is inserted
                                        isFound = true;
                                    }
                                });
                            }
                            $scope.allergiesAskedbutUnknownAllergiesShowConfirmations(confirmationListIndex);
                        });
                    }
                    else {
                        //$scope.allergiesAskedButUnknownSelectedUnKnnownAllergies = getSelectedRowsFromGrid($scope.allergiesAskedbutUnknownAllergiesWidgets.AskedbutUnknownAllergiesGrid);//making empty if confrimations has values to send the comments info as selected
                        // $scope.allergiesAskedButUnknownSelectedUnKnnownAllergies.push({ AllergyInfo: "", AllergyInfoID: item.ConfirmationType });//pushing the comments as inserted 
                        $scope.allergiesAskedbutUnknownAllergiesInfoOKClick(50);//calling the save 
                    }

                }

            });
        }
        else {
            $scope.allergiesAskedbutUnknownAllergiesInfoOKClick(1);//calling the save 
        }
    };







    //$scope.allergiesAskedbutUnknownAllergiesInfoPageInit();

}]);