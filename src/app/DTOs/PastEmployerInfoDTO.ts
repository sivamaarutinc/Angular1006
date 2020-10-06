import { Tools } from 'src/app/models/tools';
export interface PastEmployerInfoDTO {
  employerAddress: string;
  employerInBusiness: boolean;
  employerName: string;
  employmentEndDate: string;
  employmentStartDate: string;
  jobTitle: string;
  toolsUsed: Array<Tools>;
  country?: string;
  employerPhoneNumber?: string;
  provinceOrState?: string;
}
