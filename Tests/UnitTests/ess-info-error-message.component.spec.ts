import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssInfoErrorMessageComponent } from '../../src/app/features/exchange-set/ess-info-error-message/ess-info-error-message.component';
import { DialogueModule } from '@ukho/design-system';
import { EssInfoErrorMessageService, InfoErrorMessage } from '../../src/app/core/services/ess-info-error-message.service';
describe('EssInfoErrorMessageComponent', () => {
  let component: EssInfoErrorMessageComponent;
  let fixture: ComponentFixture<EssInfoErrorMessageComponent>;
  let essInfoErrorMessageService: EssInfoErrorMessageService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogueModule],
      declarations: [ EssInfoErrorMessageComponent ],
      providers: [EssInfoErrorMessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EssInfoErrorMessageComponent);
    component = fixture.componentInstance;
    essInfoErrorMessageService = TestBed.inject(EssInfoErrorMessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set inital error messages', () => {
    component.ngOnInit();
    const errObj = {
      showInfoErrorMessage : false,
      messageType : 'info',
      messageDesc : ''
    };
    expect(component.displayErrorMessage).toBe(errObj.showInfoErrorMessage);
    expect(component.messageDesc).toBe(errObj.messageDesc);
    expect(component.messageType).toBe(errObj.messageType);
  });

  it('ngOnDestroy should essInfoErrorMessagesubscription.unsubscribe', () => {
    component.essInfoErrorMessagesubscription.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.essInfoErrorMessagesubscription.unsubscribe).toHaveBeenCalled();
  });

  it.each`
   messageVisible | messageType     | messageDesc         
   ${true}        | ${'info'}       | ${'test info 1'}
   ${true}        | ${'error'}      | ${'test error 1'}
   ${true}        | ${'success'}    | ${'test success 1'}
   ${true}        | ${'warning'}    | ${'test warning 1'}
   ${true}        | ${'info'}       | ${'test info 2'}
   ${true}        | ${'error'}      | ${'test error 3'}
   ${true}        | ${'success'}    | ${'test success 4'}
   ${true}        | ${'warning'}    | ${'test warning 5'}
   ${false}       | ${'info'}      | ${''}
    `('showMessage should set correct mesages : $messageVisible $messageType , $messageDesc',
    // eslint-disable-next-line max-len
    ({ messageVisible , messageType, messageDesc }: { messageVisible: boolean; messageType: 'info' | 'warning' | 'success' | 'error'; messageDesc: string }) => {
      const errObj = {
        showInfoErrorMessage : messageVisible,
        messageType,
        messageDesc
      };
    essInfoErrorMessageService.showInfoErrorMessage = errObj;
    let messageOutput = errObj.messageDesc;
    if(messageOutput){
      messageOutput = '<h3 aria-live=\"polite\" role=\"alert\" class=\"warningMsgTitle\">'+errObj.messageDesc+'</h3>';
    }
    expect(component.displayErrorMessage).toBe(errObj.showInfoErrorMessage);
    expect(component.messageDesc).toBe(messageOutput);
    expect(component.messageType).toBe(errObj.messageType);
  });
});
