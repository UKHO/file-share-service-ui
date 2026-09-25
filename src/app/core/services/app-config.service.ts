export class AppConfigService {
    static settings: any;
    static isLoaded = false;

    static getSettings(): any {
        if (!AppConfigService.isLoaded || !AppConfigService.settings) {
            throw new Error('Application configuration has not finished loading yet.');
        }

        return AppConfigService.settings;
    }

    static setSettings(settings: unknown): void {
        AppConfigService.settings = settings;
        AppConfigService.isLoaded = true;
    }
}




