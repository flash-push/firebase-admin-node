/*! firebase-admin v13.5.0 */
import { AppMetadata, AppPlatform } from './app-metadata';
/**
 * Metadata about a Firebase Web App.
 */
export interface WebAppMetadata extends AppMetadata {
    platform: AppPlatform.WEB;
}
export declare class WebApp {
    readonly appId: string;
    private readonly requestHandler;
    private readonly resourceName;
    /**
     * Retrieves metadata about this iOS app.
     *
     * @returns A promise that
     *     resolves to the retrieved metadata about this iOS app.
     */
    getMetadata(): Promise<WebAppMetadata>;
    /**
     * Sets the optional user-assigned display name of the app.
     *
     * @param newDisplayName - The new display name to set.
     *
     * @returns A promise that resolves when the display name has
     *     been set.
     */
    setDisplayName(newDisplayName: string): Promise<void>;
    /**
       * Gets the configuration artifact associated with this app.
       *
       * @returns A promise that resolves to the Android app's
       *     Firebase config file, in UTF-8 string format. This string is typically
       *     intended to be written to a JSON file that gets shipped with your Android
       *     app.
       */
    getConfig(): Promise<string>;
}
