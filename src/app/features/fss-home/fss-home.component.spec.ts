 import { FssHomeComponent } from './fss-home.component';


describe('FssHomeComponent', () => {
  let component: FssHomeComponent;

  it('should exist', () => {
    component = new FssHomeComponent();
    component.ngOnInit();
   expect(component).toBeDefined();
  })
})

