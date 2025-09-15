import { FirebaseProjectManagementError } from '../utils/error';
import * as validator from '../utils/validator';
import { ProjectManagementRequestHandler, assertServerResponse } from './project-management-api-request-internal';
import { AppMetadata, AppPlatform } from './app-metadata';

/**
 * Metadata about a Firebase Web App.
 */
export interface WebAppMetadata extends AppMetadata {
  platform: AppPlatform.WEB;
}

export class WebApp {
  private readonly resourceName: string;

  /**
   * @internal
   */
  constructor(
      public readonly appId: string,
      private readonly requestHandler: ProjectManagementRequestHandler) {
    if (!validator.isNonEmptyString(appId)) {
      throw new FirebaseProjectManagementError(
        'invalid-argument', 'appId must be a non-empty string.');
    }

    this.resourceName = `projects/-/webApps/${appId}`;
  }

  /**
   * Retrieves metadata about this iOS app.
   *
   * @returns A promise that
   *     resolves to the retrieved metadata about this iOS app.
   */
  public getMetadata(): Promise<WebAppMetadata> {
    return this.requestHandler.getResource(this.resourceName)
      .then((responseData: any) => {
        assertServerResponse(
          validator.isNonNullObject(responseData),
          responseData,
          'getMetadata()\'s responseData must be a non-null object.');

        const requiredFieldsList = ['name', 'appId', 'projectId', 'bundleId'];
        requiredFieldsList.forEach((requiredField) => {
          assertServerResponse(
            validator.isNonEmptyString(responseData[requiredField]),
            responseData,
            `getMetadata()'s responseData.${requiredField} must be a non-empty string.`);
        });

        const metadata: WebAppMetadata = {
          platform: AppPlatform.WEB,
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
  public setDisplayName(newDisplayName: string): Promise<void> {
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
  public getConfig(): Promise<string> {
    return this.requestHandler.getConfig(this.resourceName)
      .then((responseData: any) => {
        assertServerResponse(
          validator.isNonNullObject(responseData),
          responseData,
          'getConfig()\'s responseData must be a non-null object.');
  
        const base64ConfigFileContents = responseData.configFileContents;
        assertServerResponse(
          validator.isBase64String(base64ConfigFileContents),
          responseData,
          'getConfig()\'s responseData.configFileContents must be a base64 string.');
  
        return Buffer.from(base64ConfigFileContents, 'base64').toString('utf8');
      });
  }
}