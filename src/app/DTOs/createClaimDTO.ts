import { CommunicationLanguage } from 'src/app/enums/communication-language';
export interface CreateClaimDTO {
  email: string;
  dateOfBirth: string;
  status: string;
  communicationLanguage: CommunicationLanguage;
}
