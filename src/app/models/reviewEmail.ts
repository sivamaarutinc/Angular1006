import { Status } from '../enums/status';
import { CommunicationLanguage } from 'src/app/enums/communication-language';

//  This class is responsible for declare Schema of Review Email of review page

export class ReviewEmail {
  claimId?: number;
  creationDate?: string;
  email?: string;
  emailWithConsent: string;
  status: Status;
  referenceNumber?: string;
  submitionDate?: string;
  communicationLanguage?: CommunicationLanguage;
  dateOfBirth?: Date | string;
  consentGivenBy?: string;
}
