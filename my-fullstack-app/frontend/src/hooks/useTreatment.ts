import { useEffect, useState } from "react";
import api from '../services/api';

// 對應 Treatment 的型別定義
export interface TreatmentItem {
  Id: number;
  OrdreNo: string;
  Step: number;
  FrontAndBack: string;
  DiscomfortArea: string;
  DiscomfortSituation: string;
  DiscomfortPeriod: string;
  PossibleCauses: string;
  TreatmentHistory: string;
  HowToKnowOur: string;
  HospitalFormUrl: string;
  TreatmentConsentFormUrl: string;
  Subjective: string;
  Objective: string;
  Assessment: string;
  Plan: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsDelete: boolean;
  OptionUserId: number;
  UserId: number;
  PatientId: number;
}

export default function useTreatment(
  patientname: string,
  doctortid: number | null | undefined,
  startTime: Date | null | undefined,
  endTime: Date | null | undefined,
  refreshKey: number
) {
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      api.get<TreatmentItem[]>("/api/doctors/GetTreatmentList", {
        params: {
          patientname: patientname,
          doctortid: doctortid,
          starttime: startTime?.toISOString(),
          endtime: endTime?.toISOString(),
        },
      })
        .then((res) => setTreatments(res.data))
        .catch((err) => console.error("API Error:", err))
        .finally(() => setLoading(false));
    };

    fetchTreatments();
  }, [patientname, doctortid, startTime, endTime, refreshKey]);

  return { treatments, loading };
}