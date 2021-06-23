import { Component, OnInit } from '@angular/core';
import { PhaseBannerComponent } from '@ukho/design-system'
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-fss-phase-banner',
  templateUrl: './fss-phase-banner.component.html',
  styleUrls: ['./fss-phase-banner.component.scss']
})
export class FssPhaseBannerComponent extends PhaseBannerComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
      this.phase = AppConfigService.settings["fssConfig"].phase;
      this.link = 'mailto:' + AppConfigService.settings["fssConfig"].feedbackEmailId;
  }
}
