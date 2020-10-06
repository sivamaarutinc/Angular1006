import { Component, OnChanges, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileUpload } from 'src/app/models/fileUpload';
import { Documents } from 'src/app/models/documets';
import { EmploymentInfo } from 'src/app/models/employmentInfo';
import { DocumentType } from 'src/app/enums/document-type';
import { SupportingDocumentsService } from 'src/app/services/supporting-documents.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Claim } from 'src/app/models/claim';

@Component({
  selector: 'app-supporting-documents',
  templateUrl: './supporting-documents.component.html',
  styleUrls: ['./supporting-documents.component.css'],
})

/* This class is responsible for Attach files proof of employment / copy of your audiogram. */
/* Employement sort info(address, name, number) . Upload atleast one employment file  */
export class SupportingDocumentsComponent implements OnInit, OnChanges, OnDestroy {

  public fileName: string;
  public spinner: boolean = false;
  public hasAudiogram: boolean = false;
  public hasProofOfEmployment: boolean = false;
  public audiogramSize: number;
  public proofFiles: Array<FileUpload> = new Array<FileUpload>();
  public healthcareErrormessage: any = '';
  public empErrormessage: any = '';
  public pastEmploymentInfoId: any;
  public companyErrormessage = [];
  public healthcareCompanyErrormessage: boolean = false;
  public employeDocumentsList: any = [];
  public audiogramFiles: Array<FileUpload> = [];
  public empFiles: Array<FileUpload> = [];
  public audiogramDocumentsList: any = [];
  public audiogramFilesProgress: boolean = false;
  public employementFilesProgress: boolean = false;
  public canNavigate: boolean = false;
  public companyList: Array<EmploymentInfo> = new Array<EmploymentInfo>();
  public fileNameerrorname: string;
  public virusFileError: boolean = false;
  @Input() employmentInfo: EmploymentInfo;
  @Input() public claimId: number;
  @Input() public referenceNumber: string;
  @Input() public claimDocumentsList: Array<Documents> = new Array<Documents>();
  @Input() set stepper(value: string) {
    if (value == '3') {
      this.empErrormessage = '';
      this.healthcareErrormessage = '';
    }
  }

  @Output() next: EventEmitter<void> = new EventEmitter();
  @Output() previous: EventEmitter<void> = new EventEmitter();

  supportingDocumentsForm = new FormGroup({
    supportingDocumentsarr: new FormControl('yes', Validators.required),
  });

  public healthCareInfoId: number;
  constructor(private supportingDocumentsService: SupportingDocumentsService) { }

  ngOnInit(): void {
  }

  ngOnChanges() {


    this.companyList = [];
    this.healthcareErrormessage = '';
    this.empErrormessage = '';
    this.companyErrormessage = [];
    this.healthcareCompanyErrormessage = false;
    this.canNavigate = false;
    const claim = sessionStorage.getItem('claim');
    if (claim) {
      const claimData: Claim = JSON.parse(claim);
      this.healthCareInfoId = claimData?.healthCareProviderInformation?.healthCareInfoId;

      if (this.employmentInfo) {
        this.empFiles = [];
        // if (this.employmentInfo.currentlyEmployed) {
        //   this.companyList.push({
        //     employmentInfoId: this.employmentInfo.employmentInfoId,
        //     currentEmployerName: this.employmentInfo.currentEmployerName,
        //     currentEmployerAddress: this.employmentInfo.currentEmployerAddress,
        //     companyFile: null,
        //     currentEmployerPhoneNumber: this.employmentInfo.currentEmployerPhoneNumber
        //   });
        // }

        if (this.employmentInfo.pastEmploymentInformationList &&
          this.employmentInfo.pastEmploymentInformationList.length > 0) {
          for (const pastEmploymentInformation of this.employmentInfo.pastEmploymentInformationList) {
            this.companyList.push({
              employmentInfoId: pastEmploymentInformation.pastEmploymentInfoId,
              currentEmployerName: pastEmploymentInformation.employerName,
              currentEmployerAddress: pastEmploymentInformation.employerAddress,
              companyFile: null,
              currentEmployerPhoneNumber: pastEmploymentInformation.employerPhoneNumber
            });
          }
          this.pastEmploymentInfoId = this.employmentInfo.pastEmploymentInformationList[0].pastEmploymentInfoId;
        }
      }

      // if (this.claimDocumentsList) {
      if (claimData?.claimDocumentsList?.length) {
        this.audiogramFiles = [];
        this.audiogramDocumentsList = [];
        this.empFiles = [];
        for (const claimDocuments of claimData.claimDocumentsList) {
          if (claimDocuments.documentType === DocumentType.EMPLOYMENT) {
            const newProofFile: FileUpload = new FileUpload();
            newProofFile.fileName = claimDocuments.documentName;
            newProofFile.fileSize = claimDocuments.documentSize;
            newProofFile.companyId = claimDocuments.claimDocumentId;
            newProofFile.documentId = claimDocuments.claimDocumentId;
            this.empFiles.push(newProofFile);
            localStorage.setItem('claimDocumentsList', JSON.stringify(this.empFiles));
            // const idx = this.companyList.findIndex(x => x.employmentInfoId === claimDocuments.referenceId);
            // if (idx !== -1) {
            //   const newProofFile: FileUpload = new FileUpload();
            //   newProofFile.fileName = claimDocuments.documentName;
            //   newProofFile.fileSize = claimDocuments.documentSize;
            //   newProofFile.companyId = claimDocuments.referenceId;
            //   newProofFile.documentId = claimDocuments.claimDocumentId;
            //   this.companyList[idx].companyFile = newProofFile;
            //   this.employeDocumentsList[idx] = claimDocuments;
            //   // sessionStorage.setItem('claimDocumentsList', JSON.stringify(this.employeDocumentsList));
            //   if (!this.isUploadinprogress()) {
            //     this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('yes');
            //   }
            //   else {
            //     this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('');
            //   }
            // }
          } else {
            const newProofFile: FileUpload = new FileUpload();
            newProofFile.fileName = claimDocuments.documentName;
            newProofFile.fileSize = claimDocuments.documentSize;
            newProofFile.companyId = claimDocuments.claimDocumentId;
            newProofFile.documentId = claimDocuments.claimDocumentId;
            this.audiogramFiles.push(newProofFile);
            localStorage.setItem('audiogramDocumentsList', JSON.stringify(this.audiogramFiles));
          }
        }
      }
      else {
        this.audiogramFiles = [];
        this.audiogramDocumentsList = [];
        this.empFiles = [];
        localStorage.removeItem('claimDocumentsList');
        localStorage.removeItem('audiogramDocumentsList');
      }

    }
  }

  ngOnDestroy() {

  }

  @Input() set resultofSaveonExit(value: string) {
    this.saveData(value);
  }
  saveData(name) {
    if (sessionStorage.getItem('component') === '3') {
      if (name === 'exitsupportingdoc') {

      }
    }
  }

  // drag & drop file
  async uploadFile(event, type?, companyId?, index?, control?) {

    this.healthcareErrormessage = '';
    this.healthcareCompanyErrormessage = false;
    // this.companyErrormessage = [];
    this.fileNameerrorname = '';

    // return new Promise((resolve, reject) => {
    for (const files of event) {
      await new Promise((resolve, reject) => {
        const name = files.name.split('.');
        const flnm = name[0];
        const validRegEx = /^[a-zA-Z0-9-_() ]+$/;
        if (flnm.search(validRegEx) === -1 || name.length > 2) {
          type !== 'proof' ? this.healthcareErrormessage = 'validation' : this.empErrormessage = 'validation';
          control.value = '';
          this.fileNameerrorname = files.name;
          return;
        }


        const size = Math.round((files.size / 1024));

        const extension = String(this.getExtension(files.name)).toUpperCase();
        if (['PDF', 'TIFF', 'TIF', 'JPG', 'JPEG', 'DOC', 'DOCX'].indexOf(extension) === -1) {
          type !== 'proof' ? this.healthcareErrormessage = 'file' : this.empErrormessage = 'file';
          control.value = '';
          this.fileNameerrorname = files.name;
        }
        else if (files.name.length >= 255) {
          type !== 'proof' ? this.healthcareErrormessage = 'name' : this.empErrormessage = 'name';
          control.value = '';
          this.fileNameerrorname = files.name;
        }
        else if (size < 5 || size > 10250) {
          if (size < 5) {
            type !== 'proof' ? this.healthcareErrormessage = 'lesssize' : this.empErrormessage = 'lesssize';
            control.value = '';
            this.fileNameerrorname = files.name;
          }
          if (size > 10250) {
            type !== 'proof' ? this.healthcareErrormessage = 'greatersize' : this.empErrormessage = 'greatersize';
            control.value = '';
            this.fileNameerrorname = files.name;
          }
        }
        else {
          if (type === 'proof') {

            // if (this.companyList[0].companyFile) {
            //   this.empErrormessage = 'maxlength';
            //   // this.companyErrormessage[0] = 'maxlength';
            //   control.value = '';
            //   this.fileNameerrorname = files.name;
            //   return;
            // }
          } else {
            if (this.audiogramFiles.length > 9) {
              this.healthcareErrormessage = 'maxfileupload';
              control.value = '';
              this.fileNameerrorname = files.name;
              return;
            }
          }

          let fileName = files.name;
          fileName = fileName.split('.').slice(0, -1).join('.');
          fileName = fileName.replace(/;/g, '');
          fileName = fileName.split('.').join('');
          fileName = fileName.replace(/%/g, '');
          fileName = fileName.replace(/$/g, '');
          fileName = `${fileName}.${extension}`;
          if (type === 'proof') {
            // this.companyList[index].inprogress = true;
            this.employementFilesProgress = true;
          } else {
            this.audiogramFilesProgress = true;
          }

          // this.supportingDocumentsService.scanFile(event[files], fileName).subscribe(x => {
          //   if (x.indexOf('true') > -1) {
          if (type === 'proof') {

            if (this.empFiles.length > 49) {
              this.empErrormessage = 'maxlength50';
              this.employementFilesProgress = false;
              return;
            }


            const formData: FormData = new FormData();
            formData.append('documentType', DocumentType.EMPLOYMENT);
            formData.append('document', files);
            formData.append('documentName', fileName);
            formData.append('documentSize', files.size);
            formData.append('formId', '5');
            formData.append('referenceId', companyId);

            const token = sessionStorage.getItem('access_token');
            this.supportingDocumentsService.createDocument(this.claimId, formData, token).subscribe((x: Documents) => {
              // if (x.error) {
              //   this.companyList[index].inprogress = false;
              //   this.companyErrormessage[index] = 'uploadfileerr';
              // }
              // else {
              const newProofFile: FileUpload = new FileUpload();
              newProofFile.fileName = x.documentName;
              newProofFile.fileSize = x.documentSize;
              newProofFile.companyId = x.referenceId;
              newProofFile.documentId = x.claimDocumentId;
              this.employementFilesProgress = false;
              if (this.empFiles.length > 49) {
                this.empErrormessage = 'maxlength50';

                return;
              }
              this.empFiles.push(newProofFile);
              localStorage.setItem('claimDocumentsList', JSON.stringify(this.empFiles));
              // if (this.companyList[index].employmentInfoId === companyId) {
              //   this.companyList[index].companyFile = newProofFile;
              // }
              // this.companyList[index].inprogress = false;

              this.employeDocumentsList[index] = x;
              // sessionStorage.setItem('claimDocumentsList', JSON.stringify(this.employeDocumentsList));
              if (!this.isUploadinprogress()) {
                this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('yes');
              }
              else {
                this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('');
              }
              // }

              // }).catch((err: any) => {
              //   this.companyList[index].inprogress = false;
              //   this.companyErrormessage[index] = 'uploadfileerr';
              resolve(x);

            }
              ,
              error => {
                // this.companyList[index].inprogress = false;
                // this.companyErrormessage[index] = 'uploadfileerr';
                this.empErrormessage = 'uploadfileerr';
                this.fileNameerrorname = fileName;
                this.employementFilesProgress = false;
                if (error.error && error.error.errorCd) {
                  if (error.error.errorCd == "NIHLVA004") {
                    this.virusFileError = true
                    this.empErrormessage = 'virusFileErroremployment';
                  } else {
                    this.virusFileError = false;
                  }
                }
              });
          }
          else {
            const formData: FormData = new FormData();
            formData.append('documentType', DocumentType.HEALTHCARE);
            formData.append('document', files);
            formData.append('documentName', fileName);
            formData.append('documentSize', files.size);
            formData.append('formId', '3275');
            formData.append('referenceId', this.healthCareInfoId.toString());

            const token = sessionStorage.getItem('access_token');
            this.supportingDocumentsService.createDocument(this.claimId, formData, token).subscribe((x: Documents) => {
              // if (x.error) {
              //   this.audiogramFilesProgress = false;
              //   this.healthcareErrormessage = 'uploadfileerr';
              // }
              // else {
              const newProofFile: FileUpload = new FileUpload();
              newProofFile.fileName = x.documentName;
              newProofFile.fileSize = x.documentSize;
              newProofFile.companyId = null;
              newProofFile.documentId = x.claimDocumentId;
              this.audiogramFilesProgress = false;
              if (this.audiogramFiles.length > 9) {
                this.healthcareErrormessage = 'maxfileupload';
                control.value = '';
                this.fileNameerrorname = files.name;
                return;
              }
              this.audiogramFiles.push(newProofFile);
              this.audiogramDocumentsList.push(x);
              localStorage.setItem('audiogramDocumentsList', JSON.stringify(this.audiogramFiles));
              // }
              resolve(x);

            },
              error => {
                this.audiogramFilesProgress = false;
                this.healthcareErrormessage = 'uploadfileerr';
                this.fileNameerrorname = fileName;

                if (error.error && error.error.errorCd) {
                  if (error.error.errorCd == "NIHLVA004") {
                    this.virusFileError = true
                    this.healthcareErrormessage = 'virusFileErroraudiogram';
                  } else {
                    this.virusFileError = false;
                  }
                }
              });
          }
          control.value = '';
          // } else {
          //   const msg = "Virus file";
          //   type !== "proof" ? this.healthcareErrormessage = 'virus' : this.companyErrormessage[index] = 'virus';
          //   if (type === "proof") {
          //     this.companyList[index].inprogress = false;
          //   } else {
          //     this.audiogramFilesProgress = false;
          //   }
          // }

          // });
        }
      });
    }

  }

  deleteAttachment(index, type?, documentId?) {
    this.healthcareCompanyErrormessage = false;
    this.healthcareErrormessage = '';
    this.empErrormessage = '';
    // this.companyErrormessage = [];
    this.fileNameerrorname = '';
    if (type === 'proof') {

      const token = sessionStorage.getItem('access_token');
      this.supportingDocumentsService.deleteDocument(this.claimId, documentId, token).subscribe(x => {
        this.empFiles.splice(index, 1);
        localStorage.setItem('claimDocumentsList', JSON.stringify(this.empFiles));
        // this.companyList[index].companyFile = null;

        // if (this.empFiles.length) {
        //localStorage.setItem('claimDocumentsList', JSON.stringify(this.empFiles));
        // }
        // if (this.employeDocumentsList.length) {
        //   this.employeDocumentsList[index].documentName = null;
        //   // sessionStorage.setItem('claimDocumentsList', JSON.stringify(this.employeDocumentsList));
        // }
        // if (!this.isUploadinprogress()) {
        //   this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('yes');
        // }
        // else {
        //   this.supportingDocumentsForm.get('supportingDocumentsarr').setValue('');
        // }
      }
        ,
        error => {
        });

    } else {
      const token = sessionStorage.getItem('access_token');
      this.supportingDocumentsService.deleteDocument(this.claimId, documentId, token).subscribe((x: any) => {
        this.audiogramFiles.splice(index, 1);
        this.audiogramDocumentsList.splice(index, 1);
        localStorage.setItem('audiogramDocumentsList', JSON.stringify(this.audiogramFiles));
      });
    }
  }

  gotoPrevious = () => {
    // this.canNavigate = false;
    // if (!this.isUploadinprogress()) {
    this.previous.emit();
    // } else {
    //   this.canNavigate = true;
    // }
  }

  gotoNext = () => {
    this.empErrormessage = '';
    this.healthcareErrormessage = '';
    // if (this.companyList.length) {
    //   for (let i = 0; i < this.companyList.length; i++) {
    //     if (!this.companyList[i].companyFile) {
    //       const focusId = 'test' + i;
    //       document.getElementById(focusId).focus();
    //     }
    //   }
    // }


    // this.canNavigate = false;
    // if (!this.isUploadinprogress()) {
    this.healthcareCompanyErrormessage = false;
    this.next.emit();
    // } else {
    //   this.canNavigate = true;
    // }
  }

  private getExtension(filename: string) {
    return filename.split('.').pop();
  }

  private isUploadinprogress() {
    this.healthcareCompanyErrormessage = true;
    this.healthcareErrormessage = '';
    // this.companyErrormessage = [];
    this.empErrormessage = '';
    this.fileNameerrorname = '';
    for (const companylist of this.companyList) {
      if (!companylist.companyFile) {
        return true;
      }
      if (companylist.inprogress) {
        return true;
      }
    }
    if (this.audiogramFilesProgress) {
      return true;
    }
    return false;
  }

}

