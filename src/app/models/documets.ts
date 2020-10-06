import { DocumentType } from '../enums/document-type';


export class Documents {
    claimDocumentId: number;
    document: any;
    documentName: string;
    documentType: DocumentType;
    formId: string;
    referenceId: number;
    documentSize?: string;
}
