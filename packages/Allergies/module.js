
const moduleName = 'EMR.Allergies';

//here you might need to add your dependencies which you are consuming
/**
 * ModalPopupService,
EMRCommonFactory,
CommonService, are consumed add relevant modules of these services
 */

const dependenciesModules = [];

const app = angular.module(moduleName, dependenciesModules);


export { app, moduleName };
