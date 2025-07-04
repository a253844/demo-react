import { useEffect, useState } from "react";
import api from '../services/api';

// 對應 Treatment 的型別定義
export interface ReceiptItem {
  Id: number;
  ordreNo: string;
  ReceiptUrl: string;
  ReceiptOrdreNo: string;
  ReceiptCreatedAt: string;
  ReceiptUpdatedAt: string;
  ReceiptOptionUserId: number;
  PatientId: number;
}

export default function useReceipt(
  patientname: string,
  nationalId: string,
  startTime: Date | null | undefined,
  endTime: Date | null | undefined,
  refreshKey: number
) {
  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      api.get<ReceiptItem[]>("/api/receipt/GetList", {
        params: {
          patientname: patientname,
          nationalId: nationalId,
          starttime: startTime?.toISOString(),
          endtime: endTime?.toISOString(),
        },
      })
        .then((res) => setReceipts(res.data))
        .catch((err) => console.error("API Error:", err))
        .finally(() => setLoading(false));
    };

    fetchReceipts();
  }, [patientname, nationalId, startTime, endTime, refreshKey]);

  return { receipts, loading };
}