import { app } from "../../module";
import template from "./index.html";


app.component('allergies-add-edit-free-text', {
    template: template,
    controller: 'AllergiesAddEditFreeTextController'
});

//*******PURPOSE: THIS Controller Is created for adding or updating free text Allergies For the Patient
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 02/16/2015
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.controller('AllergiesAddEditFreeTextController', ['$scope', 'ModalPopupService', 'AllergiesService', 'EMRCommonFactory', function ($scope, ModalPopupService, AllergiesService, EMRCommonFactory) {

    const arr1 = [1, 2, 3];//testing es6
    const arr2 = [1, 2, 3];//testing es6
    let obj12 = {};
    const obj123 = {};

    $scope.allergiesAddEditAAAAA = [...arr1, ...arr2, ...obj12, ...obj123];

    const [obj1, ob2, obj3] = [1, 2, 3];//destrucuturing


    this.$onInit = function () {
        $scope.allergiesAddEditFreeTextPageInit();
    }

    //PAGE INIT METHOD
    $scope.allergiesAddEditFreeTextPageInit = function () {

        //EDIT MODE
        if (hasValue($scope.EMRDataFromPopup.selectedAllergyInfo)) {

            $("#btnAllergiesAddEditFreeTextSave").val("Update");//RENAMING THE BUTTON
            //$("#btnAllergiesAddEditFreeTextSave").html("Update");//RENAMING THE BUTTON
            $scope.allergiesAddEditFreeTextPageTitle = "Edit Free text for Allergies";
            $scope.allergiesFreeTextAddEditPatientInfo = $scope.EMRDataFromPopup.PatientInfo;
            $scope.allergiesFreeTextAddEditParentData = $scope.EMRDataFromPopup.selectedAllergyInfo;
            $scope.allergiesAddEditFreeText = $scope.allergiesFreeTextAddEditParentData.Allergen_TypeName;
        }
        //ADD MODE
        else {
            $scope.allergiesAddEditFreeTextPageTitle = "Add Free Text for Allergies";
            $scope.allergiesFreeTextAddEditPatientInfo = $scope.EMRDataFromPopup.PatientInfo;
        }
    };


    //###################  METHOD TO SAVE OR UPDATE ALLERGIES FREE TEXT INFORMATION BLOCK START  #########################
    /// *******PURPOSE: THIS METHOD IS USEFUL FOR ADDING/UPDATING THE FREE TEXT FOR ALERGIES FROM THE PAST HISTORY.
    ///*******CREATED BY: SRINIVAS M
    ///*******CREATED DATE: 02/16/2015
    //THIS METHOD IS USEFUL IN ADDING/UPDATING THE ALLERGIES INFORMATION
    $scope.allergiesFreeTextAddEditUpdate = function (isConfirmationRequired) {

        if (!hasValue($scope.allergiesAddEditFreeText)) {
            ShowErrorMessage('Please Enter Free Text');
            $scope.AllergiesAddEditFreeTextFocus = true;

            return false;//IF NO DATA IS ENTERED
        }

        //EDIT MODE
        if (hasValue($scope.allergiesFreeTextAddEditParentData)) {

            var postData = {
                PatientID: $scope.allergiesFreeTextAddEditPatientInfo.PatientID,
                AllergyDetailsID: $scope.allergiesFreeTextAddEditParentData.AllergyDetailsID,
                AllergiesFreeText: $scope.allergiesAddEditFreeText,
                AppointmentID: $scope.allergiesFreeTextAddEditPatientInfo.AppointmentId,
                Allergen_TypeID: 0 //for free text
            };

            //UPDATING THE ALLERGIES FREE TEXT
            AllergiesService.allergiesSaveorUpdatePatientAllergiesFreeTextInformation(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) {
                    $scope.AllergiesAddEditFreeTextFocus = true;
                    $("#txtAllergiesAddEditFreeText").focus();
                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Update Allergies Free Text for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.CHANGE, $scope.allergiesFreeTextAddEditPatientInfo.PatientID, EMRPracticeModel.LoggedUserID);
                    return false;
                }
                EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Update Allergies Free Text for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.CHANGE, $scope.allergiesFreeTextAddEditPatientInfo.PatientID, EMRPracticeModel.LoggedUserID);
                $scope.OK();//CLOSE THE POPUP
            });

        }
        //NEW MODE
        else {

            var postData = {
                PatientID: $scope.allergiesFreeTextAddEditPatientInfo.PatientID,
                AllergiesFreeText: $scope.allergiesAddEditFreeText,
                AppointmentID: $scope.allergiesFreeTextAddEditPatientInfo.AppointmentId,
                Allergen_TypeID: 0 //for free text
            };

            if (hasValue(isConfirmationRequired)) {
                postData.IsConfirmationRequired = false;
            }

            //CALLING THE ALLERGIES FREE TEXT SAVE OR UPDATE SERVICE
            AllergiesService.allergiesSaveorUpdatePatientAllergiesFreeTextInformation(postData).then(function (serviceResponse) {
                if (isError(serviceResponse)) {
                    $scope.AllergiesAddEditFreeTextFocus = true;
                    $("#txtAllergiesAddEditFreeText").focus();
                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documenting Allergies Free Text for a Patient", EHRAuditLogStatus.Failure, EHRAuditLogActions.ADDITION, $scope.allergiesFreeTextAddEditPatientInfo.PatientID, EMRPracticeModel.LoggedUserID);
                    return false;
                }

                if (hasValue(serviceResponse) && hasValue(serviceResponse.confirmationModelList) && serviceResponse.confirmationModelList.length > 0) {
                    ModalPopupService.OpenPopup(/*EMRApplicationPath + 'Home/Index/50'*/GetEMRPageURLByIndex(50), serviceResponse.confirmationModelList[0].ConformationMessage, 'md').then(function (result) {
                        if (result == "NO") {
                            return false;
                        }
                        else if (result == "YES") {
                            $scope.allergiesFreeTextAddEditUpdate("yes");
                        }
                    });
                }
                else {
                    EMRCommonFactory.EHRSaveAuditLogInformation(EHRAuditLogXperEMR_Components.Allergies, "Allergies", "Documenting Allergies Free Text for a Patient", EHRAuditLogStatus.Success, EHRAuditLogActions.ADDITION, $scope.allergiesFreeTextAddEditPatientInfo.PatientID, EMRPracticeModel.LoggedUserID);
                    $scope.OK();//CLOSE THE POPUP
                }
            });
        }
    };
    //###################  METHOD TO SAVE OR UPDATE ALLERGIES FREE TEXT INFORMATION BLOCK END  #########################


    //CALLING THE INIT METHOD
    //$scope.allergiesAddEditFreeTextPageInit();


}]);
