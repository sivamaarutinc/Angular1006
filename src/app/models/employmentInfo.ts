import { PastEmployerInfo } from './pastEmployerInfo';
import { FileUpload } from './fileUpload';

//  This class is responsible for declare Schema of EmploymentInfo
export class EmploymentInfo {
  employmentInfoId?: number;
  currentEmployerAddress?: string;
  currentEmployerIsHazardous?: boolean;
  currentEmployerName?: string;
  currentEmployerPhoneNumber?: string;
  currentSituation?: string;
  currentlyEmployed?: boolean;
  hasEverBeenSelfEmployed?: boolean;
  hasRetired?: boolean;
  hasUsedNoisyEquipmentOutOfWork?: boolean;
  noisyEquipmentDetails?: string;
  retirementDate?: Date | string;
  selfEmpBusinessAddress?: string;
  selfEmpBusinessName?: string;
  selfEmpEndDate?: Date | string;
  selfEmpHasInsurance?: boolean;
  selfEmpStartDate?: Date | string;
  pastEmploymentInformationList?: Array<PastEmployerInfo>;
  companyFile?: FileUpload;
  inprogress?: boolean;
  constructor() { }
}
