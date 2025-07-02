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

  const treatmentItemsUsed = receipts.map(r => r.treatmentItem);

  useEffect(() => {
    loadReceipts();
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
    const second = Math.floor(now.getSeconds() / 10) * 10;       // 取十秒位 (0, 10, 20, ..., 50)
    const tenSecond = String(second).padStart(2, '0');

    return Number(`${minute}${second}${tenSecond}`);
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
              OrdreNo: ordreNo
            },
            responseType: 'blob'  // 這裡很重要，要告訴 axios 以 blob 格式取得資料
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
    <Toolbar
      start={
        <div className="flex gap-2 align-items-end">
          <Dropdown
            value={treatmentItem}
            options={treatmentOptions.filter(o => !treatmentItemsUsed.includes(o.value))}
            onChange={(e) => setTreatmentItem(e.value)}
            placeholder="選擇項目"
          />
          <InputNumber 
            value={treatmentMoney}
            onValueChange={(e) => setTreatmentMoney(Number(e.target.value))}
            placeholder="金額"
          />
          <Button label="新增" icon="pi pi-plus" onClick={addRow} disabled={receipts.length >= 5} />
          <Button label="儲存" icon="pi pi-save" severity="success" onClick={saveToServer} />
          <Button label="開立收據" icon="pi pi-file-pdf" severity="secondary" onClick={exportToPDF} /> 
        </div>
      }
    />
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