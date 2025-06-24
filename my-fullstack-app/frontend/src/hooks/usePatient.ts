import { useEffect, useState } from "react";
import api from '../services/api';
import internal from "stream";

// 定義 PatientsItem 中每筆物件的型別
interface PatientsItem {
    Id: number;
    FullName: string;
    Gender: number;
    Phone: string;
    Address: string;
    BirthDate: string;
    NationalId: string;
    MedicalHistory: string;
    ExerciseHabit: string;
    ExerciseFrequency: string;
    InjuryHistory: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    IsDelete: boolean;
    OptionUserId: number;
}

export default function usePatient(FullName: string, StartTime: Date | null | undefined, EndTime: Date | null | undefined, RefreshKey: number ) {
  const [Patients, setPatients] = useState<PatientsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
    setLoading(true);
    api.get<PatientsItem[]>("/api/patients/GetList",  {
                params: { 
                    name: FullName, 
                    starttime: StartTime?.toISOString(), 
                    endtime: EndTime?.toISOString()
                }
            }
        )
      .then(res => setPatients(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
    };
    fetchPatients();
    }, [FullName, StartTime, EndTime, RefreshKey]);

  return { Patients, loading };
}