//  This class is responsible for declare Schema of HealthCare Provider Info

export class HealthCareProviderInfo {
  audiogramClinicAddress: string;
  audiogramClinicName: string;
  audiogramClinicPhoneNumber: string;
  dateOfFirstAudiogram?: Date | string;
  entAppointmentDate?: Date | string;
  entSpecialistAddress: string;
  entSpecialistName: string;
  entSpecialistPhoneNumber: string;
  hasHearingAid: boolean;
  hasRingingInEar: boolean;
  hasSevereRingingInEar: boolean;
  hasConstantRingingInEar: boolean;
  hasVisitedEntSpecialist: boolean;
  hearingAidUsageDate?: Date | string;
  hearingLossNoticedYear?: Date | string;
  ringingEarDuration: string;
  healthCareInfoId?: number;
}
