import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxFilesizeModule } from 'ngx-filesize';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ClaimComponent } from './components/claim/claim.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { MyInformationComponent } from './components/wizard/my-information/my-information.component';
import { HealthCareComponent } from './components/wizard/health-care/health-care.component';
import { EmploymentComponent } from './components/wizard/employment/employment.component';
import { SupportingDocumentsComponent } from './components/wizard/supporting-documents/supporting-documents.component';
import { ReviewComponent } from './components/wizard/review/review.component';
import { ConfirmationComponent } from './components/wizard/confirmation/confirmation.component';
import { AddEmployerModalComponent } from './components/wizard/employment/add-employer-modal/add-employer-modal.component';
import { DragDropFileDirective } from './directives/drag-drop-file.directive';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { PrintComponent } from './components/wizard/print/print.component';
import { PrinterHeaderComponent } from './components/wizard/print/printer-header/printer-header.component';
import { PrinterFooterComponent } from './components/wizard/print/printer-footer/printer-footer.component';
import { YesNoPipe } from './components/pipes/yes-no.pipe';
import { IntlTelInputComponent } from './components/intl-tel-input/intl-tel-input.component';
import { WizardSuccessComponent } from './components/wizard/wizard-success/wizard-success.component';
import { FormDirective } from './components/wizard/form.directive';
import { FocusDirective } from './components/wizard/focus.directive';
import { MatIconModule } from '@angular/material/icon';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ToastrModule } from 'ngx-toastr';
import { AuthLogoutComponent } from './components/authentication/auth-logout/auth-logout.component';
import { AuthCallbackComponent } from './components/authentication/auth-callback/auth-callback.component';
import { AuthResumeCallbackComponent } from './components/authentication/auth-resume-callback/auth-resume-callback.component';
import { LandingComponent } from './components/landing/landing.component';
import { ModalComponent } from './components/landing/modal/modal.component';
import { TimeOutComponent } from './components/wizard/time-out/time-out.component';
import { TokenInterceptor } from './interceptor/token.interceptors';
import { ReferenceNumberInterceptor } from './interceptor/reference-number.interceptor';
import { SkipToMainComponent } from './components/skip-to-main/skip-to-main.component';
import { DynamicScriptsService } from './services/dynamic-scripts.service';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ClaimComponent,
    WizardComponent,
    MyInformationComponent,
    HealthCareComponent,
    EmploymentComponent,
    SupportingDocumentsComponent,
    ReviewComponent,
    ConfirmationComponent,
    AddEmployerModalComponent,
    DragDropFileDirective,
    FieldErrorDisplayComponent,
    PrintComponent,
    PrinterHeaderComponent,
    PrinterFooterComponent,
    YesNoPipe,
    IntlTelInputComponent,
    WizardSuccessComponent,
    FormDirective,
    FocusDirective,
    AuthLogoutComponent,
    AuthCallbackComponent,
    AuthResumeCallbackComponent,
    LandingComponent,
    ModalComponent,
    TimeOutComponent,
    SkipToMainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgxMaskModule.forRoot(),
    NgxFilesizeModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    //  GooglePlaceModule,
    AutocompleteLibModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: false,
      progressBar: true,
      // positionClass: 'toast-bottom-center',
      preventDuplicates: true,

    }) // ToastrModule added
  ],
  exports: [
    MatStepperModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    DragDropFileDirective,
    MatDatepickerModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    DynamicScriptsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReferenceNumberInterceptor,
      multi: true
    }
  ],
  entryComponents: [WizardSuccessComponent, ModalComponent],
  bootstrap: [AppComponent]
})

export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {

  if (sessionStorage.getItem('currentLang') == null) {
    if (window.navigator.language.includes('fr')) {
      sessionStorage.setItem('currentLang', 'fr');
    } else {
      sessionStorage.setItem('currentLang', 'en');
    }
  }

  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
