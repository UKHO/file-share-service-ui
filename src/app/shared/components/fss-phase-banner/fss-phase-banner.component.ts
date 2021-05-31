import { Component, OnInit } from '@angular/core';
import { PhaseBannerComponent } from '@ukho/design-system'
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Component({
  selector: 'app-fss-phase-banner',
  templateUrl: './fss-phase-banner.component.html',
  styleUrls: ['./fss-phase-banner.component.scss']
})
export class FssPhaseBannerComponent extends PhaseBannerComponent implements OnInit {

  constructor(private envService: EnvironmentService) {
    super();
  }

  ngOnInit(): void {
    this.phase = 'alpha',
      this.link = 'mailto:' + this.envService.getFssConfiguration().feedbackEmailId;
  }
}
