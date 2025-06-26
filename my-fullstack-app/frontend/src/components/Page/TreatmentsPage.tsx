import React, {useState, useRef, useEffect}from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import useTreatment from '../../hooks/useTreatment';
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import useUser from '../../hooks/useUser';
import api from "../../services/api"; 
import { Toast } from "primereact/toast";
import { Tag } from 'primereact/tag';
import { format } from "date-fns";

interface OptionItem {
  code: number;
  name: string;
}

const TreatmentsPage: React.FC = () => {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [name, setName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [doctortId, setDoctortId] = useState<number | null | undefined>(undefined);
    const [starttime, setStarttime] = useState<Date | null | undefined>(undefined);
    const [endtime, setEndtime] = useState<Date | null | undefined>(undefined);
    const [refreshKey, setRefreshKey] = useState(0);
    const [deletedFlag, setDeletedFlag] = useState(false);

    const { userRole, Roleloading } =  useUser(2);
    const [userOptions, setUserOptions] = useState<OptionItem[]>([]);

    const [searchParams, setSearchParams] = useState({
        name: '',
        nationalId: '',
        doctortId: null as number | null | undefined,
        starttime: null as Date | null | undefined,
        endtime: null as Date | null | undefined,
        refreshKey: 0,
    });

    const { treatments, loading } = useTreatment(
        searchParams.name, 
        searchParams.nationalId, 
        searchParams.doctortId, 
        searchParams.starttime, 
        searchParams.endtime, 
        refreshKey
    );

    const getStep = (status: string) => {
        switch (status) {
            case '10':
                return 'info';

            case '20':
                return 'warning';

            case '30':
                return 'danger';

            case '40':
                return 'success';

            case 'renewal':
                return null;
        }
    };

    const genderdict: { [key: string]: string } = {
        "1": "男性",
        "2": "女性",
        "3": "其他"
    };

    const stepdict: { [key: string]: string } = {
        "10": "新案",
        "20": "治療",
        "30": "上傳",
        "40": "結案"
    };

    useEffect(() => {
        if (deletedFlag && !loading) {
            toast.current?.show({ severity: "success", summary: "成功", detail: "病患資料已刪除" });
            setDeletedFlag(false); // 重置
        }
    }, [loading]);

    useEffect(() => {
        if (!Roleloading && userRole.length > 0) {
             console.log("userRole =", userRole);
            const simplified = userRole.map((user) => ({
                code: user.userId,
                name: user.userName,
            }));
            setUserOptions(simplified);
        }
    }, [Roleloading, userRole]);

    const handleSearchClick = () => {
        setRefreshKey(refreshKey + 1)
        setSearchParams({ name, nationalId, doctortId, starttime, endtime, refreshKey});
    };

    const handleAddClick = () => {
        navigate("/patientsdetail");
    };

    const handleDelete = async (Id:string) => {
        try {
            await api.get("/api/doctors/Delete",  {
                    params: { 
                        id: Id
                    }
                }
            );
            setDeletedFlag(true);
            Reload();
        } catch (error) {
            toast.current?.show({ severity: "error", summary: "錯誤", detail: "刪除失敗"});
        }
    };

    const Reload = () => {
        // 重新觸發 usePatient，等於重新查詢
        setRefreshKey(prev => prev + 1);
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
                        onClick={() => navigate(`/treatmentsDetail`, { state: { patient: rowData } })} 
                        size="small" 
                        severity="info" 
                        style={{ fontSize: '1rem', margin: '3px' }} 
                    />
                    <Button 
                        label="結案" 
                        type="button" 
                        icon="pi pi-clipboard" 
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
    const stepBodyTemplate = (rowData: any) => {
        return (
            <div>
                <Tag value={stepdict[String(rowData.step)]} severity={getStep(String(rowData.step))} />
            </div>
        );
    };

    const genderBodyTemplate = (rowData: any) => {
        var data = String(rowData.patientGender)
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
                <div className="col-6 md:col-2">
                    <InputText
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="病患姓名" />
                </div>
                <div className="col-5 md:col-2">
                    <Dropdown 
                        value={doctortId} 
                        onChange={(e: DropdownChangeEvent) =>  setDoctortId(e.value)} 
                        options={userOptions} 
                        optionLabel="name" 
                        placeholder="醫師選單" />
                </div>
                <div className="col-6 md:col-2">
                    <InputText
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="病患身分證" />
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
            </div>
            <div className="card">
                    <DataTable
                      value={treatments}
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 20, 30, 40]}
                      tableStyle={{ minWidth: '50rem' }}
                      paginatorLeft={paginatorLeft}
                      paginatorRight={paginatorRight}
                    >
                      <Column field="ordreNo" header="案號" style={{ width: '5%' }} />
                      <Column field="patientName" header="病患姓名" style={{ width: '5%' }} />
                      <Column field="doctorName" header="治療醫師" style={{ width: '5%' }} />
                      <Column field="patientGender" header="性別" style={{ width: '3%' }} body={genderBodyTemplate}/>
                      <Column field="patientGender" header="年齡" style={{ width: '3%' }} />
                      <Column field="step" header="階段" style={{ width: '3%' }} body={stepBodyTemplate}/>
                      <Column field="createdAt" header="新增日期" style={{ width: '8%' }} body={(rowData) => formatDate(rowData.createdAt)} />
                      <Column field="updatedAt" header="更新日期" style={{ width: '8%' }} body={(rowData) => formatDate(rowData.createdAt)}/>
                      <Column field="optionUserId" header="操作人" style={{ width: '5%' }} />
                      <Column field="option" header="功能" style={{ width: '12%' }} body={optionBodyTemplate} />
                    </DataTable>
                  </div>
        </div>
    );
};

export default TreatmentsPage;