import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogModule} from '@angular/material/dialog';

import { ToastrService,ToastrModule } from 'ngx-toastr';
import { WizardSuccessComponent } from './wizard-success.component';
import { TranslateService,TranslateModule} from '@ngx-translate/core';

describe('WizardSuccessComponent', () => {
  let component: WizardSuccessComponent;
  let fixture: ComponentFixture<WizardSuccessComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardSuccessComponent ],
      imports: [TranslateModule.forRoot(),MatDialogModule,ToastrModule.forRoot()],
      providers: [ToastrService,TranslateService, {
        provide: MatDialogRef,
        useValue: mockDialogRef
      },
      { provide: MAT_DIALOG_DATA, useValue: {} },
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
