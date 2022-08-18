import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EssListEncsComponent } from '../../src/app/features/exchange-set/ess-list-encs/ess-list-encs.component';
import { DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule  , CheckboxModule} from '@ukho/design-system';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EssUploadFileService } from '../../src/app/core/services/ess-upload-file.service';
import { AppConfigService } from '../../src/app/core/services/app-config.service';
describe('EssListEncsComponent', () => {
  let component: EssListEncsComponent;
  let fixture: ComponentFixture<EssListEncsComponent>;
  const router = {
    navigate: jest.fn()
  };
  const service = {
    getValidEncs : jest.fn().mockReturnValue(['AU210130', 'AU210140', 'AU220130', 'AU220150', 'AU314128']),
    clearSelectedEncs : jest.fn(),
    getSelectedENCs: jest.fn(),
    infoMessage : true,
    addSelectedEnc : jest.fn(),
    removeSelectedEncs : jest.fn(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EssListEncsComponent ],
      imports: [CommonModule, DialogueModule, FileInputModule, RadioModule, ButtonModule, CardModule, TableModule, CheckboxModule],
      providers: [
        {
        provide : Router,
        useValue : router
        },
        {
          provide : EssUploadFileService,
          useValue : service
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    AppConfigService.settings = {
      essConfig: {
      MaxEncLimit: 100,
      MaxEncSelectionLimit : 5
      }
    };
    fixture = TestBed.createComponent(EssListEncsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
