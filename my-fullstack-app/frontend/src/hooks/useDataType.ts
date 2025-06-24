import { useEffect, useState } from "react";
import api from '../services/api';
import internal from "stream";

// 定義 MenuItem 中每筆物件的型別
interface DataTypeItem {
  itemId: number;
  number: string;
  name: string;
  isEnabled: boolean;
}

// 定義 MenuGroupItem 中每筆物件型別
interface DataTypeGroupItem {
  groupId: number;
  groupName: string;
  isEnabled: boolean;
  dataTypes: DataTypeItem[];
}

export default function useDataType() {
  const [dataType, setdataType] = useState<DataTypeGroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    api.get<DataTypeGroupItem[]>("/api/system/GetDataType")
      .then(res => setdataType(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
    }, []);

  return { dataType, loading };
}