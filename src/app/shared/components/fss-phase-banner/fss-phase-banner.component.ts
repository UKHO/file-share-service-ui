import { Component } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-fss-phase-banner',
  templateUrl: './fss-phase-banner.component.html',
  styleUrls: ['./fss-phase-banner.component.scss']
})
export class FssPhaseBannerComponent {
  phase: string = AppConfigService.settings["fssConfig"].phase;
  link: string = 'mailto:' + AppConfigService.settings["fssConfig"].feedbackEmailId;
  
}
