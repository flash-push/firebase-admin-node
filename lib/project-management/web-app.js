/*! firebase-admin v13.5.0 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApp = void 0;
const error_1 = require("../utils/error");
const validator = require("../utils/validator");
const project_management_api_request_internal_1 = require("./project-management-api-request-internal");
const app_metadata_1 = require("./app-metadata");
class WebApp {
    /**
     * @internal
     */
    constructor(appId, requestHandler) {
        this.appId = appId;
        this.requestHandler = requestHandler;
        if (!validator.isNonEmptyString(appId)) {
            throw new error_1.FirebaseProjectManagementError('invalid-argument', 'appId must be a non-empty string.');
        }
        this.resourceName = `projects/-/webApps/${appId}`;
    }
    /**
     * Retrieves metadata about this iOS app.
     *
     * @returns A promise that
     *     resolves to the retrieved metadata about this iOS app.
     */
    getMetadata() {
        return this.requestHandler.getResource(this.resourceName)
            .then((responseData) => {
            (0, project_management_api_request_internal_1.assertServerResponse)(validator.isNonNullObject(responseData), responseData, 'getMetadata()\'s responseData must be a non-null object.');
            const requiredFieldsList = ['name', 'appId', 'projectId', 'bundleId'];
            requiredFieldsList.forEach((requiredField) => {
                (0, project_management_api_request_internal_1.assertServerResponse)(validator.isNonEmptyString(responseData[requiredField]), responseData, `getMetadata()'s responseData.${requiredField} must be a non-empty string.`);
            });
            const metadata = {
                platform: app_metadata_1.AppPlatform.WEB,
                resourceName: responseData.name,
                appId: responseData.appId,
                displayName: responseData.displayName || null,
                projectId: responseData.projectId,
            };
            return metadata;
        });
    }
    /**
     * Sets the optional user-assigned display name of the app.
     *
     * @param newDisplayName - The new display name to set.
     *
     * @returns A promise that resolves when the display name has
     *     been set.
     */
    setDisplayName(newDisplayName) {
        return this.requestHandler.setDisplayName(this.resourceName, newDisplayName);
    }
    /**
       * Gets the configuration artifact associated with this app.
       *
       * @returns A promise that resolves to the Android app's
       *     Firebase config file, in UTF-8 string format. This string is typically
       *     intended to be written to a JSON file that gets shipped with your Android
       *     app.
       */
    getConfig() {
        return this.requestHandler.getConfig(this.resourceName)
            .then((responseData) => {
            (0, project_management_api_request_internal_1.assertServerResponse)(validator.isNonNullObject(responseData), responseData, 'getConfig()\'s responseData must be a non-null object.');
            const base64ConfigFileContents = responseData.configFileContents;
            (0, project_management_api_request_internal_1.assertServerResponse)(validator.isBase64String(base64ConfigFileContents), responseData, 'getConfig()\'s responseData.configFileContents must be a base64 string.');
            return Buffer.from(base64ConfigFileContents, 'base64').toString('utf8');
        });
    }
}
exports.WebApp = WebApp;
