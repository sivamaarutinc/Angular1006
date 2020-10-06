import { EmploymentInfo } from './employmentInfo';
import { PersonalInfo } from './personalInfo';
import { HealthCareProviderInfo } from './healthCareProviderInfo';
import { Documents } from './documets';

//  This class is responsible for declare Schema of Claim page
export class Claim {
  claimId: number;
  email: string;
  referenceNumber: string;
  status: string;
  creationDate: Date;
  submitionDate: Date;
  emailWithConsent: string;
  hasConsentForEmail: boolean;
  personalInformation?: PersonalInfo;
  healthCareProviderInformation?: HealthCareProviderInfo;
  employmentInformation?: EmploymentInfo;
  claimDocumentsList?: Array<Documents>;
  constructor() { }
}
