import { DocumentType } from '../enums/document-type';
export interface DocumentsDTO {
    document: any;
    documentName: string;
    documentType: DocumentType;
    formId: string;
    referenceId: number;
}
