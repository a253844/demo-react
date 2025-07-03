import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import api from "../../services/api"; 
import connection  from "../../services/signalr"; 
import { InputNumber } from 'primereact/inputnumber';

interface Receipt {
  id?: number;
  treatmentItem: string;
  treatmentMoney: number;
  treatmentId: number;
  patientId: number;
  ordreNo?: string;
}

const treatmentOptions = [
  { label: '物理治療評估', value: '物理治療評估' },
  { label: '筋膜鬆動術', value: '筋膜鬆動術' },
  { label: '關節鬆動術', value: '關節鬆動術' },
  { label: '運動治療', value: '運動治療' },
  { label: '其他', value: '其他' }
];

const ReceiptsDetailPage: React.FC = () => {
  const location = useLocation();
  const treatment = location.state?.treatment;
  
  const [treatmentItem, setTreatmentItem] = useState('');
  const [treatmentMoney, setTreatmentMoney] = useState<number>(0);
  const [ordreNo, setOrdreNo] = useState<string>('');
  const toast = useRef<Toast>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

    const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const treatmentItemsUsed = receipts.map(r => r.treatmentItem);

  useEffect(() => {
    loadReceipts();

    connection
    .start()
    .then(() => {
      console.log("已連線至 SignalR");
      console.log("連線 ID", connection.connectionId);
    })
    .catch(err => console.error("SignalR 連線失敗:", err));

  connection.on("ReportProgress", (value) => {
    setProgress(value);
  });

  connection.on("ReportFinished", (msg) => {
    setMessage(msg);
  });

  return () => {
    connection.stop();
  };

  }, []);

  const loadReceipts = async () => {
    try {
      const res = await api.get('/api/receipt/GetList', {
        params: {
          treatmentId: treatment.id,
          ordreNo: ordreNo
        }
      });
      setReceipts(res.data);
      if (res.data.length > 0) {
        setOrdreNo(res.data[0].ordreNo); // 綁定 OrdreNo
      }
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: '錯誤', detail: '讀取收據資料失敗' });
    }
  };

  const getNo = () =>{
    const now = new Date();

    const minute = String(now.getMinutes()).padStart(2, '0');    // 取得分 (0~59)
    const second = String(now.getTime()).substr(8)

    return Number(`${minute}${second}`);
  }

  const addRow = () => {
    if (!treatmentItem || !treatmentMoney) return alert('請填寫完整欄位');
    if (receipts.length >= 4) return alert('最多只能新增 4 筆資料');
    if (treatmentItemsUsed.includes(treatmentItem)) return alert('項目名稱不可重複');

    const newRow: Receipt = {
      id: getNo(),
      treatmentItem,
      treatmentMoney,
      treatmentId: treatment.id,
      patientId: treatment.patientId,
    };
    setReceipts([...receipts, newRow]);
    setTreatmentItem('');
    setTreatmentMoney(0);
  };

  const deleteRow = (rowData: Receipt) => {
    if(receipts.length == 1){
      toast.current?.show({ severity: 'error', summary: '錯誤', detail: "資料請勿少於一筆" });
    }else{
      const updated = receipts.filter((r) => r.id !== rowData.id);
      setReceipts(updated);
    }
    
  };

  const saveToServer = async () => {
    try {
      if (!ordreNo) {
        // 新增模式
        const res = await api.post('/api/receipt/Insert', receipts);
        toast.current?.show({ severity: 'success', summary: '成功', detail: res.data.msg });
        setOrdreNo(res.data.ordreNo); // 取得新的 OrdreNo
      } else {
        // 更新模式
        const updated = receipts.map(r => ({
          ...r,
          ordreNo
        }));
        await api.put('/api/receipt/Update', updated);
        toast.current?.show({ severity: 'success', summary: '成功', detail: '更新完成' });
      }
    } catch (err: any) {
      const detail = err?.response?.data || '儲存失敗';
      toast.current?.show({ severity: 'error', summary: '錯誤', detail });
    }
  };

  const exportToPDF = async () => {
    console.log('送出到後端', receipts);
    try {
          const response = await api.get("/api/receipt/ExportReceiptsPdf", {
            params: { 
              TreatmentId: treatment.id,
              OrdreNo: ordreNo,
              connectionId: connection.connectionId
            },
            responseType: 'blob'  // blob 格式取得資料
          });
          
          toast.current?.show({ severity: "success", summary: "成功", detail: "收據製作成功"});

          // 產生blob url
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);

          // 在新分頁開啟PDF
          window.open(fileURL);
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "錯誤", detail: "收據製作失敗"});
        }
  };

  const actionBodyTemplate = (rowData: Receipt) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => deleteRow(rowData)}
      />
    );
  };

  const toolbar = (
        <div className="card flex flex-wrap p-fluid">
          <div className="col-6 md:col-2">
            <div className="flex-auto">
              <label className="font-bold block mb-2">治療項目</label>
              <Dropdown
                value={treatmentItem}
                options={treatmentOptions.filter(o => !treatmentItemsUsed.includes(o.value))}
                onChange={(e) => setTreatmentItem(e.value)}
                placeholder="請選擇"
              />
            </div>
          </div>
          <div className="col-5 md:col-2">
            <div className="flex-auto">
              <label htmlFor="mile" className="font-bold block mb-2">金額</label>
              <InputNumber 
                value={treatmentMoney}
                onValueChange={(e) => setTreatmentMoney(Number(e.target.value))}
                
              />
            </div>
          </div>
          <div className=" flex flex-wrap col-11 md:col-5">
            <div className="flex col-4 md:col-2">
              <div className="flex-auto">
                <label className="font-bold block mb-2"> </label>
                <Button label="新增" icon="pi pi-plus" onClick={addRow} disabled={receipts.length >= 5} />
              </div>
            </div>
            <div className="flex col-4 md:col-2">
              <div className="flex-auto">
                <label className="font-bold block mb-2"> </label>
                <Button label="儲存" icon="pi pi-save" severity="success" onClick={saveToServer} />
              </div>
            </div>
            <div className="flex col-5 md:col-3">
              <div className="flex-auto">
                <label className="font-bold block mb-2"> </label>
                <Button label="開立收據" icon="pi pi-file-pdf" severity="secondary" onClick={exportToPDF} /> 
              </div>
            </div>
            <div className="flex col-5 md:col-2">
              <div className="flex-auto">
                <label className="font-bold block mb-2">表產生進度</label>
                <progress value={progress} max="100" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
  );

return (
    <div className="card">
      <Toast ref={toast} />
      {toolbar}
      <DataTable value={receipts} dataKey="id">
        <Column field="treatmentItem" header="項目" />
        <Column dataType="numeric" field="treatmentMoney" header="金額" />
        <Column body={actionBodyTemplate} header="刪除" />
      </DataTable>
    </div>
  );
};

export default ReceiptsDetailPage;