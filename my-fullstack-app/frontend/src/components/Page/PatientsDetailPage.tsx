import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputTextarea  } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect  } from "react";
import api from "../../services/api"; 
import useDataType from '../../hooks/useDataType';
import { Checkbox, CheckboxChangeEvent  } from "primereact/checkbox";

interface Patient {
    fullName: string;
    gender: string;
    phone: string;
    address: string;
    birthDate: Date | null;
    emergencycontact: string,
    emergencyrelationship: string,
    emergencyphone: string,
    nationalId: string;
    medicalHistory: string;
    exerciseHabit: string;
    exerciseFrequency: string;
    injuryHistory: string;
}

const genderOptions = [
    { label: "男", value: 1 },
    { label: "女", value: 2 },
];

const PatientsDetailPage: React.FC = () => {
    const location = useLocation();
    const patient = location.state?.patient;
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { dataType, loading } =  useDataType();
    const [selectedMedicalHistories, setSelectedMedicalHistories] = useState<string[]>([]);
    const medicalHistoryOptions = dataType.find(group => group.groupId === 8)?.dataTypes ?? [];

    const [formData, setFormData] = useState<Patient>({
        fullName: "",
        gender: "",
        phone: "",
        address: "",
        birthDate: null,
        emergencycontact: "",
        emergencyrelationship: "",
        emergencyphone: "",
        nationalId: "",
        medicalHistory: "",
        exerciseHabit: "",
        exerciseFrequency: "",
        injuryHistory: "",
    });

    useEffect(() => {
        if (patient) {
            setFormData({
            ...patient,
            birthDate: patient.birthDate ? new Date(patient.birthDate) : null,
            });

            setSelectedMedicalHistories(
            patient.medicalHistory?.split(", ") || []
            );
        }
        }, [patient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDropdownChange = (name: keyof Patient, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (patient) {
            // 編輯模式
            await api.put(`/api/patients/Update/`, formData)
            .then((res) => toast.current?.show({ severity: "success", summary: "成功", detail: "病患資料已更新" }) )
            .catch((err) => toast.current?.show({ severity: "error", summary: "更新失敗", detail: err.response.data}) );
        } else {
            // 新增模式
            await api.post("/api/patients/Insert", formData)
            .then((res) => toast.current?.show({ severity: "success", summary: "成功", detail: "病患資料已新增" }) )
            .catch((err) => toast.current?.show({ severity: "error", summary: "新增失敗", detail: err.response.data}) );
        }
        setTimeout(() => navigate("/patients"), 1500); // 送出後導回列表頁
    };

    const handleMedicalHistoryChange = (e: CheckboxChangeEvent) => {
        let updated = [...selectedMedicalHistories];
        if (e.checked) {
            updated.push(e.value);
        } else {
            updated = updated.filter(val => val !== e.value);
        }
        setSelectedMedicalHistories(updated);
        setFormData(prev => ({ ...prev, medicalHistory: updated.join(", ") }));
    };

      if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <div className="grid formgrid p-fluid gap-3">
                    <div className="col-6 md:col-2">
                        <label>姓名</label>
                        <InputText name="fullName" value={formData.fullName} onChange={handleChange} />
                    </div>

                    <div className="col-5 md:col-2">
                        <label>性別</label>
                        <Dropdown value={formData.gender} options={genderOptions} onChange={(e) => handleDropdownChange("gender", e.value)} placeholder="請選擇性別" />
                    </div>

                    <div className="col-6 md:col-2">
                        <label>生日</label>
                        <Calendar value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.value as Date })} dateFormat="yy-mm-dd" showIcon />
                    </div>

                    <div className="col-5 md:col-3">
                        <label>電話</label>
                        <InputText name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="col-6 md:col-2">
                        <label>身分證字號</label>
                        <InputText name="nationalId" value={formData.nationalId} onChange={handleChange} />
                    </div>
                

                <div className="col-12 md:col-8 ">
                    <label>地址</label>
                    <InputText name="address" value={formData.address} onChange={handleChange} />
                </div>

                    <div className="col-6 md:col-4">
                        <label>緊急連絡人</label>
                        <InputText name="emergencycontact" value={formData.emergencycontact} onChange={handleChange} />
                    </div>
                    <div className="col-5 md:col-2">
                        <label>緊急連絡人關係</label>
                        <InputText name="emergencyrelationship" value={formData.emergencyrelationship} onChange={handleChange} />
                    </div>
                    <div className="col-6 md:col-4">
                        <label>緊急連絡人電話</label>
                        <InputText name="emergencyphone" value={formData.emergencyphone} onChange={handleChange} />
                    </div>
                

                <div className="col-12 md:col-6">
                    <label>系統性疾病史</label>
                    <div className="flex flex-wrap gap-3">
                        {medicalHistoryOptions.map((item) => (
                            <div key={item.itemId} className="flex align-items-center">
                                <Checkbox
                                    inputId={item.number}
                                    name="medicalHistory"
                                    value={item.name}
                                    onChange={handleMedicalHistoryChange}
                                    checked={selectedMedicalHistories.includes(item.name)}
                                />
                                <label htmlFor={item.number} className="ml-2">{item.name}</label>
                            </div>
                        ))}
                    </div>
                    <InputTextarea  name="medicalHistory" rows={3} value={formData.medicalHistory} onChange={handleChange} />
                </div>

                <div className="col-12 md:col-6">
                    <label>運動項目</label>
                    <InputTextarea name="exerciseHabit" value={formData.exerciseHabit} onChange={handleChange} />
                </div>

                <div className="col-12 md:col-5">
                    <label>運動頻率</label>
                    <InputTextarea name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange} />
                </div>

                <div className="col-12 md:col-11">
                    <label>重大意外、外傷史</label>
                    <InputTextarea  name="injuryHistory" rows={2} value={formData.injuryHistory} onChange={handleChange} />
                </div>

                <div className="col-4 md:col-2 text-center mt-2">
                    <Button label="送出" icon="pi pi-save" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default PatientsDetailPage;