import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagentaComponent } from './magenta.component';

describe('MagentaComponent', () => {
  let component: MagentaComponent;
  let fixture: ComponentFixture<MagentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
