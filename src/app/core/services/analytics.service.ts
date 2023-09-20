import { Injectable } from '@angular/core';
import { GoogleTagManagerService} from 'angular-google-tag-manager';
import { AppConfigService } from '../../core/services/app-config.service';

enum Categories {
  Login = 'User Login',
  Search = 'Search',
  ErrorHandling = 'ErrorHandling',
  Validation = 'Validation',
  DownloadAll = 'Downlodad All'
}

interface GTMEvent {
  event: string;
  event_action: string;
  event_label?: any;
  event_category: any;
}

@Injectable()
export class AnalyticsService {
  environment = AppConfigService.settings['Environment'];
  environmentPrefix ='fss-'+ this.environment;
  constructor(private gtmService: GoogleTagManagerService) {
    this.gtmService.addGtmToDom();
  }
  async login(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.login',
      event_action: 'User Login',
      event_category: Categories.Login
    };
    this.gtmService.pushTag(tag);
  }
  async searchInIt(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.searchInIt',
      event_action: 'Search InIt',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }

  async getAdvancedSearchResult(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.getAdvancedSearchResult',
      event_action: 'Get Advanced Search Result',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }

  async getSimplifiedSearchResult(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.getSimplifiedSearchResult',
      event_action: 'Get Simplified Search Result',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }

  async SearchRowAdded(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.SearchRowAdded',
      event_action: 'Search Row Added',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async SearchRowDeleted(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.SearchRowDeleted',
      event_action: 'Search Row Deleted',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async GroupAdded(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.GroupAdded',
      event_action: 'Group Added',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async GroupDeleted(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.GroupDeleted',
      event_action: 'Group Deleted',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async pageChange(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.pageChange',
      event_action: 'Page Change',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async errorHandling(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.errorHandling',
      event_action: 'Error Handling',
      event_category: Categories.ErrorHandling
    };
    this.gtmService.pushTag(tag);
  }
  async validation(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.pageChange',
      event_action: 'Page Change',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async tokenExpired(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.tokenExpired',
      event_action: 'Token Expired',
      event_category: Categories.Login
    };
    this.gtmService.pushTag(tag);
  }
  async logOut(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.logout',
      event_action: 'Logout',
      event_category: Categories.Login
    };
    this.gtmService.pushTag(tag);
  }

  async downloadAll(): Promise<void> {
    const tag: GTMEvent = {
      event: this.environmentPrefix+'.downloadAll',
      event_action: 'Download All',
      event_category: Categories.DownloadAll
    };
    this.gtmService.pushTag(tag);
  }
}
