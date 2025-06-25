import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useDataType from "../../hooks/useDataType";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Image } from 'primereact/image';
import { Slider, SliderChangeEvent } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Treatment {
  frontAndBack: string;
  discomfortArea: string;
  discomfortSituation: string;
  discomfortPeriod: string;
  discomfortDegree: number;
  possibleCauses: string;
  treatmentHistory: string;
  howToKnowOur: string;
  hospitalFormUrl: string;
  treatmentConsentFormUrl: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  patientId: number;
}

interface OptionItem {
    name: string;
    code: string;
}

const TreatmentsDetailPage: React.FC = () => {
  const location = useLocation();
  const patient = location.state?.patient;
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { dataType, loading } = useDataType();
  const [formData, setFormData] = useState<Treatment>({
    frontAndBack: "",
    discomfortArea: "",
    discomfortSituation: "",
    discomfortPeriod: "",
    discomfortDegree: 0,
    possibleCauses: "",
    treatmentHistory: "",
    howToKnowOur: "",
    hospitalFormUrl: "",
    treatmentConsentFormUrl: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    patientId: patient?.id || 0
  });

  const Option: OptionItem[] = [
        { name: '0', code: '0' },
        { name: '1', code: '1' },
        { name: '2', code: '2' },
        { name: '3', code: '3' },
        { name: '4', code: '4' },
        { name: '5', code: '5' },
        { name: '6', code: '6' },
        { name: '7', code: '7' },
        { name: '8', code: '8' },
        { name: '9', code: '9' },
        { name: '10', code: '10' }
    ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleCheckboxChange = (name: keyof Treatment, value: string, checked: boolean) => {
    setFormData(prev => {
      const current = (prev[name] || "") as string;
      const currentArr = current ? current.split(",") : [];

      const updatedArr = checked
        ? currentArr.includes(value)
          ? currentArr
          : [...currentArr, value]
        : currentArr.filter(item => item !== value);

    return { ...prev, [name]: updatedArr.join(",") };
    });
  };

  const handleDropdownChange = (name: keyof Treatment, value: number) => {
      setFormData(prev => {
        const current = (prev[name]);
        return { ...prev, [name]: value };
      });
    };

  const handleSubmit = async () => {
    debugger
    try {
      await api.post("/api/doctors/InsertTreatment", formData);
      toast.current?.show({ severity: "success", summary: "成功", detail: "治療資料已新增" });
      setTimeout(() => navigate("/treatments"), 1500);
    } catch (err: any) {
      toast.current?.show({ severity: "error", summary: "錯誤", detail: err.response?.data || "新增失敗" });
    }
  };

  const getOptions = (groupId: number) => {
    return dataType.find(group => group.groupId === groupId)?.dataTypes.map(item => ({
      label: item.name,
      value: item.name
    })) || [];
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="grid formgrid p-fluid gap-3">

        <div className="col-12 md:col-6">
          <label>前側/後側</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(1).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={(e) => handleCheckboxChange("frontAndBack", option.value, e.checked?? false)}
                checked={formData.frontAndBack.split(",").includes(option.value)}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <Image src="/images/image-body.jpg" alt="Image" width="250" />
        </div>

        <div className="col-12 md:col-6">
          <label>不適區域</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(2).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={(e) => handleCheckboxChange("discomfortArea", option.value, e.checked?? false)}
                checked={formData.discomfortArea.split(",").includes(option.value)}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
        </div>

        <div className="col-12 md:col-5">
          <label>不適情況</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(3).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={(e) => handleCheckboxChange("discomfortSituation", option.value, e.checked?? false)}
                checked={formData.discomfortSituation.split(",").includes(option.value)}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <label>可能引發原因(可複選)</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(5).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={(e) => handleCheckboxChange("possibleCauses", option.value, e.checked?? false)}
                checked={formData.possibleCauses.split(",").includes(option.value)}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
          <InputTextarea  name="medicalHistory" rows={1} value={formData.possibleCauses} onChange={handleChange} />
        </div>

        <div className="col-12 md:col-5">
          <label>不適時間</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(4).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={() => setFormData(prev => ({ ...prev, discomfortPeriod: option.value }))}
                checked={formData.discomfortPeriod === option.value}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <label>目前不適可承受程度</label>
          <div className="flex flex-wrap gap-3">
            <div className="flex col-12">
            <Dropdown 
                  value={formData.discomfortDegree} 
                  onChange={(e: DropdownChangeEvent) =>  handleDropdownChange("discomfortDegree", e.value)} 
                  options={Option} 
                  optionLabel="name" 
                  placeholder="" />
            </div>
            <div className="flex">
            <Image src="/images/NumericalRaringAcale.png" alt="Image" imageStyle={{ width: "100%", maxWidth: "550px", height: "auto" }} />
              </div>
          </div>
          
        </div>  

        <div className="col-12 md:col-5">    
          
        </div>

        <div className="col-12 md:col-6">
          <label>曾接受過相關處置</label>
          <div className="flex flex-wrap gap-3">
            {getOptions(6).map(option => (
              <div key={option.value} className="flex align-items-center">
                <Checkbox
                  inputId={`front-${option.value}`}
                  value={option.value}
                  onChange={(e) => handleCheckboxChange("treatmentHistory", option.value, e.checked?? false)}
                  checked={formData.treatmentHistory.split(",").includes(option.value)}
                />
                <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
              </div>
            ))}
          </div>
          <InputTextarea  name="medicalHistory" rows={1} value={formData.treatmentHistory} onChange={handleChange} />
        </div>

        <div className="col-12 md:col-5">
          <label>如何知道我們院所</label>
          <div className="flex flex-wrap gap-3">
          {getOptions(7).map(option => (
            <div key={option.value} className="flex align-items-center">
              <Checkbox
                inputId={`front-${option.value}`}
                value={option.value}
                onChange={() => setFormData(prev => ({ ...prev, howToKnowOur: option.value }))}
                checked={formData.howToKnowOur === option.value}
              />
              <label htmlFor={`front-${option.value}`} className="ml-2">{option.label}</label>
            </div>
          ))}
          </div>
          <InputTextarea  name="medicalHistory" rows={1} value={formData.howToKnowOur} onChange={handleChange} />
        </div>
        
        <div className="col-12 md:col-6">
          <label>主觀症狀 (S)</label>
          <InputTextarea value={formData.subjective} onChange={handleChange} />
        </div>

        <div className="col-12 md:col-5">
          <label>客觀檢查 (O)</label>
          <InputTextarea value={formData.objective} onChange={handleChange} />
        </div>

        <div className="col-12 md:col-6">
          <label>專業判斷 (A)</label>
          <InputTextarea value={formData.assessment} onChange={handleChange} />
        </div>

        <div className="col-12 md:col-5">
          <label>治療計畫 (P)</label>
          <InputTextarea value={formData.plan} onChange={handleChange} />
        </div>

        <div className="col-12 text-center">
          <Button label="送出" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default TreatmentsDetailPage;