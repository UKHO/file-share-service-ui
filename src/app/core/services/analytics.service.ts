import { Injectable } from '@angular/core';
import { GoogleTagManagerService} from 'angular-google-tag-manager';
// import { EnhancedForm } from 'src/app/components/enhanced-order-configuration/enhanced-order-configuration.component';
// import { SelectedItem } from '../../components/selected-items/selectedItem';

enum Categories {
  Login = 'User Login',
  Search = 'Search',
  ErrorHandling = 'ErrorHandling',
  Validation = 'Validation',
}

interface GTMEvent {
  event: string;
  event_action: string;
  event_label?: any;
  event_category: any;
}

@Injectable()
export class AnalyticsService {
  constructor(private gtmService: GoogleTagManagerService) {
    this.gtmService.addGtmToDom();
  }
  async searchInIt(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.searchInIt',
      event_action: 'Search InIt',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }

  async getSearchResult(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.getSearchResult',
      event_action: 'Get Search Result',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async SearchRowAdded(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.SearchRowAdded',
      event_action: 'Search Row Added',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async SearchRowDeleted(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.SearchRowDeleted',
      event_action: 'Search Row Deleted',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async GroupAdded(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.GroupAdded',
      event_action: 'Group Added',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async GroupDeleted(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.GroupDeleted',
      event_action: 'Group Deleted',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async pageChange(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.pageChange',
      event_action: 'Page Change',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async errorHandling(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.pageChange',
      event_action: 'Page Change',
      event_category: Categories.ErrorHandling
    };
    this.gtmService.pushTag(tag);
  }
  async validation(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.pageChange',
      event_action: 'Page Change',
      event_category: Categories.Search
    };
    this.gtmService.pushTag(tag);
  }
  async tokenExpired(): Promise<void> {
    const tag: GTMEvent = {
      event: 'fss.tokenExpired',
      event_action: 'Token Expired',
      event_category: Categories.Login
    };
    this.gtmService.pushTag(tag);
  }
}
