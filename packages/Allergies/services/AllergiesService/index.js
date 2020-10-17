import { app } from "../../module";

//*******PURPOSE: THIS SERVICE IS USEFUL IN COMMUNICATING WITH THE WCF METHODS OF ALLERGIES
//*******EFFECTIVE FILES: ../Views/Allergies/..
//*******CREATED BY: Mahesh P
//*******CREATED DATE: 09/15/2014
//*******MODIFIED DEVELOPER: DATE - NAME - WHAT IS MODIFIED; xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

app.service('AllergiesService', ['$http', 'CommonService', function ($http, CommonService) {


    //################### GET ALLERGIES  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/05/2014
    this.allergiesGetPatientAllergiesInfo = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetPatientAllergiesInfo", allergiesPostData)
            .then(function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES  LIST  BLOCK END #########################

    //################### GET ALLERGIES MANIFESTATION  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies manifestations list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/05/2014
    this.allergiesGetAllergyManifestationList = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergyManifestationList", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES MANIFESTATION  LIST  BLOCK END #########################


    //################### GET ALLERGIES DRUG  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies manifestations list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/05/2014
    this.allergiesGetAllergyDrugsList = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergyDrugsList", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES DRUG  LIST  BLOCK END #########################



    //################### GET ALLERGIES DRUG COMMONLY USED  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies manifestations list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/10/2014
    this.allergiesGetAllergyDrugsCommonlyUsedList = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergyDrugsCommonlyUsedList", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES DRUG  COMMONLY USED  LIST  BLOCK END #########################

    //################### GET ALLERGIES SEVERITY  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies SEVERITY list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    this.allergiesGetAllergiesSeverityList = function () {

        var postData = {
            practicemodel: EMRPracticeModel
        };

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergiesSeverityList", postData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES SEVERITY  LIST  BLOCK END #########################



    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies types list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    this.allergiesGetAllergenTypeList = function () {

        var postData = {
            practicemodel: EMRPracticeModel
        };

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergenTypesList", postData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES ALLERGEN TYPE LIST  BLOCK END #########################


    //################### GET ALLERGIES COMMONLY USED REMOVE REASONS  LIST  BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies commonly used remove reasons list for the allergy
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/06/2014
    this.allergiesGetCommonlyRemoveReasonsForAllergyList = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergyPastHxCommonlyUsedRemoveReasonsList", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES COMMONLY USED REMOVE REASONS  LIST  BLOCK START #########################


    //################### REMOVE OR DELETE ALLERGY WITH REASON BLOCK START #########################
    //*******PURPOSE: This is used for removing or deleting the allergy with reason 
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/08/2014
    this.allergiesRemoveAllergyWithReason = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        //SPECIFYING THAT IT IS A ACTION WCF CALL
        allergiesPostData.ehrAdminCurrentCallingActionType = adminWCFActionCallType.INSERTUPDATEDELETE;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "RemoveAllergyWithReason", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES COMMONLY USED REMOVE REASONS  LIST  BLOCK START #########################


    //################### SAVE ALLERGY WITH REASON BLOCK START #########################
    //*******PURPOSE: This is used for Saving the allergy
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/08/2014
    this.allergiesSavePatientAllergies = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        //SPECIFYING THAT IT IS A ACTION WCF CALL
        allergiesPostData.ehrAdminCurrentCallingActionType = adminWCFActionCallType.INSERTUPDATEDELETE;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "SavePatientAllergies", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### SAVE ALLERGY WITH REASON BLOCK END #########################



    //################### GET ALLERGIES ORGANS LIST BLOCK START #########################
    //*******PURPOSE: This is used for getting the allergies organs list from the database 
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 12/10/2014
    this.allergiesGetAllergiesOrgansList = function () {

        var postData = {
            practicemodel: EMRPracticeModel
        };

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergiesOrgansList", postData).then(
            function (result) {
                return result;
            });
    };

    //################### GET ALLERGIES ORGANS LIST BLOCK END #########################

    //################### SAVE OR UPDATE ALLERGIES FREE TEXT INFORMATION BLOCK START #########################
    //*******PURPOSE: METHOD TO CHECK THE DUPLICATE VALIDAION FOR ALLERGY FREE TEXT.
    //*******CREATED BY:  SRINIVAS M
    //*******CREATED DATE: 02/16/2015
    this.allergiesSaveorUpdatePatientAllergiesFreeTextInformation = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;

        //SPECIFYING THAT IT IS A ACTION WCF CALL
        allergiesPostData.ehrAdminCurrentCallingActionType = adminWCFActionCallType.INSERTUPDATEDELETE;

        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "SaveorUpdatePatientAllergiesFreeTextInformation", allergiesPostData).then(
            function (result) {
                return result;
            });
    };

    //################### SAVE OR UPDATE ALLERGIES FREE TEXT INFORMATION BLOCK END #########################




    //################### GET ALLERGIES DETAILED INFORMATION BLOCK START #########################
    //*******PURPOSE: this method is useful in getting the allergies detailed info list
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 02/25/2015
    this.allergiesGetPatientAllergiesDetailedInfo = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;
        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetPatientAllergiesDetailedInfo", allergiesPostData).then(
            function (result) {
                return result;
            });
    };
    //################### GET ALLERGIES DETAILED INFORMATION BLOCK END #########################

    //################### ALLERGIES ASKED BUT UNKNOWN INFORMATION BLOCK START #########################
    //*******PURPOSE: this method is useful in saving the asked but unknown allergies info
    //*******CREATED BY:  Mahesh P
    //*******CREATED DATE: 03/03/2015
    this.allergiesAskedButUnknownAllergiesInfo = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;
        //SPECIFYING THAT IT IS A ACTION WCF CALL
        allergiesPostData.ehrAdminCurrentCallingActionType = adminWCFActionCallType.INSERTUPDATEDELETE;
        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "AskedButUnknownAllergiesInfo", allergiesPostData).then(
            function (result) {
                return result;
            });
    };
    //################### ALLERGIES ASKED BUT UNKNOWN INFORMATION BLOCK END #########################


    //################### UPDATE THE FOOD ALLERGIES COMMONLY USED INFO BLOCK START #########################
    //*******PURPOSE: this method is used update the food allergies commonly used info 
    //*******CREATED BY: LAKSHMI B
    //*******CREATED DATE: 08/31/2016
    this.allergiesUpdatePatientFoodAllergiesCommonlyUsedInfo = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;
        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "UpdatePatientFoodAllergiesCommonlyUsedInfo", allergiesPostData).then(
            function (result) {
                return result;
            });
    };
    //################### ALLERGIES ASKED BUT UNKNOWN INFORMATION BLOCK END #########################


    //################### GET ALLERGIES LIST LINKED TO PATIENT BLOCK START #########################
    //*******PURPOSE: this method is used update the food allergies commonly used info 
    //*******CREATED BY: LAKSHMI B
    //*******CREATED DATE: 08/31/2016
    this.allergiesGetAllergiesListLinkedtoPatient = function (allergiesPostData) {

        allergiesPostData.practicemodel = EMRPracticeModel;
        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "GetAllergiesListLinkedtoPatient", allergiesPostData).then(
            function (result) {
                return result;
            });
    };
    //################### GET ALLERGIES LIST LINKED TO PATIENT BLOCK END #########################



    //################### ALLERGIES MANIFESTATIONS INSERT FROM SNOMED MASTER LIST  BLOCK START #########################
    //*******PURPOSE: this method is useful in saving manifestations infroamtion from snomed master list 
    //*******CREATED BY:  HEMANTH U 
    //*******CREATED DATE: MAY 24 2K18 
    this.allergiesSaveManifestationsFromSnomedMasterList = function (allergiesPostData) {
        allergiesPostData.practicemodel = EMRPracticeModel;
        //SPECIFYING THAT IT IS A ACTION WCF CALL
        allergiesPostData.ehrAdminCurrentCallingActionType = adminWCFActionCallType.INSERTUPDATEDELETE;
        return CommonService.PostData('POST', CommonService.EMRClinicalManagement_Allergies() + "SaveAllergiesManifestationsFromSNOMEDMasterList", allergiesPostData).then(
            function (result) {
                return result;
            });
    };
    //################### ALLERGIES ASKED BUT UNKNOWN INFORMATION BLOCK END #########################

}]);
