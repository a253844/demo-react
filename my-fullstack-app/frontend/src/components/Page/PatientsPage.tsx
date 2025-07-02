import React, {useState, useRef, useEffect}from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import usePatient from '../../hooks/usePatient';
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../../services/api"; 
import { Toast } from "primereact/toast";
import { format } from "date-fns";

const PatientsPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [name, setName] = useState('');
    const [starttime, setStarttime] = useState<Date | null | undefined>(undefined);
    const [endtime, setEndtime] = useState<Date | null | undefined>(undefined);
    const [refreshKey, setRefreshKey] = useState(0);
    const [deletedFlag, setDeletedFlag] = useState(false);

    const [searchParams, setSearchParams] = useState({
        name: '',
        starttime: null as Date | null | undefined,
        endtime: null as Date | null | undefined,
        refreshKey: 0,
    });

    const { Patients, loading } = usePatient(searchParams.name, searchParams.starttime, searchParams.endtime, refreshKey);

    const genderdict: { [key: string]: string } = {
        "1": "男性",
        "2": "女性",
        "3": "其他"
    };

    useEffect(() => {
        if (deletedFlag && !loading) {
            toast.current?.show({ severity: "success", summary: "成功", detail: "病患資料已刪除" });
            setDeletedFlag(false); // 重置
        }
    }, [loading]);

    const handleSearchClick = () => {
        setRefreshKey(refreshKey + 1)
        setSearchParams({ name, starttime, endtime, refreshKey});
    };

    const handleAddClick = () => {
        navigate("/patientsdetail");
    };

    const handleDelete = async (Id:string) => {
        try {
            await api.get("/api/patients/Delete",  {
                    params: { 
                        id: Id
                    }
                }
            );
            setDeletedFlag(true);
            Reload();
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "錯誤", detail: "執行失敗"});
        }
    };

    const Reload = () => {
        // 重新觸發 usePatient，等於重新查詢
        setRefreshKey(prev => prev + 1);
    }

    const NewCase = async (rowData: any) => {
        await api.get("/api/treatment/GetCaseStatus",  {
                params: { 
                    nationalId: rowData.nationalId
                }
            }
        ).then((res) => navigate(`/treatmentsDetail`, { state: { patient: rowData } }))
        .catch((err) => toast.current?.show({ severity: "error", summary: "開案失敗", detail: err.response.data}) );
    }

    const paginatorLeft = (
        <Button
            type="button"
            icon="pi pi-refresh"
            text
            onClick={() => Reload()}
        />
    );
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;
    const optionBodyTemplate = (rowData: any) => {
        return (
            <div>
                    <Button 
                        label="編輯" 
                        type="button" 
                        icon="pi pi-file-edit" 
                        onClick={() => navigate(`/patientsdetail`, { state: { patient: rowData } })} 
                        size="small" 
                        severity="info" 
                        style={{ fontSize: '1rem', margin: '3px' }} 
                    />
                    <Button 
                        label="開案" 
                        type="button" 
                        icon="pi pi-clipboard" 
                        onClick={() => NewCase(rowData)} 
                        size="small" 
                        severity="success" 
                        style={{ fontSize: '1rem', margin: '3px' }}
                    />
                    <Button 
                        label="刪除" 
                        type="button" 
                        icon="pi pi-file-excel" 
                        onClick={()=> handleDelete(rowData.id)} 
                        size="small" 
                        severity="danger" 
                        style={{  fontSize: '1rem', margin: '3px' }} 
                    />
            </div>
        );
    };

    const genderBodyTemplate = (rowData: any) => {
        var data = String(rowData.gender)
        const gendar = genderdict[data]
        return (
            <div>
                {gendar}
            </div>
        );
    };

    const formatDate = (value: string) => {
        if (!value) return "";
        const date = new Date(value);
        return format(new Date("2025-06-25T15:59:35"), "yyyy/MM/dd HH:mm:ss");
    };

    if (loading) {
          return (
            <div className="p-4">
              <ProgressSpinner />
            </div>
          );
        }

    return (
        <div>
            <Toast ref={toast} />
            <div className="card flex flex-wrap gap-3 p-fluid">
                <div className="col-8 md:col-2">
                    <InputText
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="病患姓名"
                    />
                </div>
                <div className="col-8 md:col-2">
                    <Calendar 
                        id="starttime" 
                        value={starttime} 
                        onChange={(e) => setStarttime(e.value)} 
                        placeholder="開始時間"
                        showTime 
                        hourFormat="24" 
                        showIcon/>
                </div>
                <div className="col-8 md:col-2">
                    <Calendar 
                        id="endtime" 
                        value={endtime} 
                        onChange={(e) => setEndtime(e.value)} 
                        placeholder="結束時間"
                        showTime 
                        hourFormat="24" 
                        showIcon/>
                </div>
                <div className="col-4 md:col-1">
                    <Button label="查詢" icon="pi pi-search" onClick={handleSearchClick}/>
                </div>
                <div className="col-4 md:col-1">
                    <Button label="新增" icon="pi pi-plus" onClick={handleAddClick} />
                </div>
            </div>
            <div className="card">
                    <DataTable
                      value={Patients}
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 20, 30, 40]}
                      tableStyle={{ minWidth: '50rem' }}
                      paginatorLeft={paginatorLeft}
                      paginatorRight={paginatorRight}
                    >
                      <Column field="id" header="ID" style={{ width: '5%' }} />
                      <Column field="fullName" header="姓名" style={{ width: '10%' }} />
                      <Column field="gender" header="性別" style={{ width: '5%' }} body={genderBodyTemplate}/>
                      <Column field="gender" header="年齡" style={{ width: '5%' }} />
                      <Column field="createdAt" header="新增日期" style={{ width: '10%' }} body={(rowData) => formatDate(rowData.createdAt)} />
                      <Column field="createdAt" header="更新日期" style={{ width: '10%' }} body={(rowData) => formatDate(rowData.createdAt)}/>
                      <Column field="optionUserId" header="操作人" style={{ width: '5%' }} />
                      <Column field="option" header="功能" style={{ width: '12%' }} body={optionBodyTemplate} />
                    </DataTable>
                  </div>
        </div>
    );
};

export default PatientsPage;