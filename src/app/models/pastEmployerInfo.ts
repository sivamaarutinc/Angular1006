import { Tools } from './tools';

//  This class is responsible for declare Schema Past Employer Info

export class PastEmployerInfo {
  pastEmploymentInfoId?: number;
  isEmployerInBusiness?: boolean;
  employmentStartDate?: string;
  employmentEndDate?: string;
  employerName?: string;
  employerAddress?: string;
  jobTitle?: string;
  toolsUsedList?: Array<Tools>;
  country?: string;
  employerPhoneNumber?: string;
  provinceOrState?: string;


  // employerInBusiness?: string; duplicated data

  constructor() { }
}
