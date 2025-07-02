import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import imagepath from "../../services/imagepath";
import useDataType from "../../hooks/useDataType";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Image } from 'primereact/image';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";

interface Treatment {
  ordreNo: string;
  step: number;
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
    code: number;
}

const TreatmentsDetailPage: React.FC = () => {
  const location = useLocation();
  const patient = location.state?.patient;
  const treatment = location.state?.treatment;
  const toast = useRef<Toast>(null);
  const stepperRef = useRef<Stepper>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { dataType, loading } = useDataType();
  const [formData, setFormData] = useState<Treatment>({
    ordreNo: "",
    step: 0,
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

  useEffect(() => {
      if (treatment) {
          setFormData({
            ordreNo: treatment.ordreNo || "",
            step: treatment.step || 0,
            frontAndBack: treatment.frontAndBack || "",
            discomfortArea: treatment.discomfortArea || "",
            discomfortSituation: treatment.discomfortSituation || "",
            discomfortPeriod: treatment.discomfortPeriod || "",
            discomfortDegree: treatment.discomfortDegree || 0,
            possibleCauses: treatment.possibleCauses || "",
            treatmentHistory: treatment.treatmentHistory || "",
            howToKnowOur: treatment.howToKnowOur || "",
            hospitalFormUrl: treatment.hospitalFormUrl || "",
            treatmentConsentFormUrl: treatment.treatmentConsentFormUrl || "",
            subjective: treatment.subjective || "",
            objective: treatment.objective || "",
            assessment: treatment.assessment || "",
            plan: treatment.plan || "",
            patientId: treatment.patientId || 0
          });

          if(treatment.step == 20){
            setCurrentStep(1)
          }
          if(treatment.step == 30){
            setCurrentStep(2)
          }
      }
      }, [treatment]);

  const Option: OptionItem[] = [
        { name: '0', code: 0 },
        { name: '1', code: 1 },
        { name: '2', code: 2 },
        { name: '3', code: 3 },
        { name: '4', code: 4 },
        { name: '5', code: 5 },
        { name: '6', code: 6 },
        { name: '7', code: 7 },
        { name: '8', code: 8 },
        { name: '9', code: 9 },
        { name: '10', code: 10 }
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

  const handleSubmit = async (step:number) => {

    var detail = "治療資料已更新";

    if(step == 40){
      detail = "治療完成已結案"
      if(formData.hospitalFormUrl == '' && formData.treatmentConsentFormUrl == ''){
        toast.current?.show({ severity: "error", summary: "結案失敗", detail: "請上傳治療同意書或醫院診斷書"})
        return
      }
    }

    if (formData.ordreNo === "") {
        // 新增模式
        await api.post("/api/treatment/Insert", formData)
        .then((res) => {
          setFormData(
            (prev) => ({...prev,ordreNo: res.data.ordreNo})
          ); 
          toast.current?.show({ severity: "success", summary: "成功", detail: res.data.msg }) } )
        .catch((err) => toast.current?.show({ severity: "error", summary: "新增失敗", detail: err.response.data}) );       
    }
    else{
      // 編輯模式
      formData.step = formData.step > step ? formData.step : step;
      setFormData(
            (prev) => ({...prev,step: formData.step})
          ); 
      await api.put("/api/treatment/Update", formData)
        .then((res) => toast.current?.show({ severity: "success", summary: "成功", detail: detail }) )
        .catch((err) => toast.current?.show({ severity: "error", summary: "更新失敗", detail: err.response.data}) );  
    }

    if(step == 40){
      setTimeout(() => navigate("/treatments"), 1500); // 送出後導回列表頁
    }
  };

  // 上傳
  const handleCustomUpload = async (event: FileUploadHandlerEvent, type: 'hospital' | 'consent') => {
    const file = event.files?.[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const response = await api.post("/api/system/UploadFile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      debugger
      const fileName = response.data.fileName;

      // ✅ 直接更新 formData 裡的對應欄位
      setFormData(prev => ({
        ...prev,
        [type === 'hospital' ? 'hospitalFormUrl' : 'treatmentConsentFormUrl']: fileName,
      }));

      handleSubmit(30)

    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "錯誤",
        detail: "上傳失敗",
      });
    }
  };

  const getOptions = (groupId: number) => {
    return dataType.find(group => group.groupId === groupId)?.dataTypes.map(item => ({
      label: item.name,
      value: item.name
    })) || [];
  };

  const checkStep = (step:number) => {
      if (step == 20 && formData.ordreNo === ""){
        toast.current?.show({ severity: "error", summary: "錯誤", detail: "初次開案請存檔" })
      }else{
        stepperRef.current?.nextCallback()
      }
    };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <div className="card flex justify-content-center">
        <Stepper ref={stepperRef} activeStep={currentStep} style={{ flexBasis: '100%' }}>
            <StepperPanel header="症狀描述">
              <div className="flex flex-column">
                <div className="grid formgrid p-fluid gap-3 justify-content-center">

                  <div className="col-5 md:col-5" >
                    <label>patientId</label>
                    <div className="flex flex-wrap gap-3">
                      <InputTextarea  name="patientId" rows={1} value={formData.patientId?.toString()} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-5 md:col-5" >
                    <label>ordreNo</label>
                    <div className="flex flex-wrap gap-3">
                      <InputTextarea  name="ordreNo" rows={1} value={formData.ordreNo?.toString()} onChange={handleChange} />
                    </div>
                  </div>


                  <div className="col-12 md:col-6">
                    <label>前側/後側</label>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex flex-wrap gap-3 col-12">
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
                      <div className="flex">
                        <Image src="/images/image-body.jpg" alt="Image" width="250" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 md:col-5">
                    <label>目前不適可承受程度</label>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex col-12">
                      <Dropdown 
                            value={formData.discomfortDegree} 
                            onChange={(e: DropdownChangeEvent) =>  handleDropdownChange("discomfortDegree", e.value)} 
                            options={Option} 
                            optionLabel="name" 
                            optionValue="code"
                            placeholder="" />
                      </div>
                      <div className="flex">
                        <Image src="/images/NumericalRaringAcale.png" alt="Image" imageStyle={{ width: "100%", maxWidth: "550px", height: "auto" }} />
                      </div>
                    </div>
                    
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
                    <InputTextarea  name="possibleCauses" rows={1} value={formData.possibleCauses} onChange={handleChange} />
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
                    <InputTextarea  name="treatmentHistory" rows={1} value={formData.treatmentHistory} onChange={handleChange} />
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
                    <InputTextarea  name="howToKnowOur" rows={1} value={formData.howToKnowOur} onChange={handleChange} />
                  </div>
                </div>  
              </div>
              <div className="flex pt-4 justify-content-between">
                  <div></div>
                  <Button label="存檔" severity="success" icon="pi pi-upload" onClick={() => handleSubmit(10)} />
                  <Button label="下一步" icon="pi pi-arrow-right" iconPos="right" onClick={() => checkStep(20)} />
              </div>
            </StepperPanel>

            <StepperPanel header="醫師診療">
              <div className="flex flex-column">
                <div className="grid formgrid p-fluid gap-3 justify-content-center">
                  <div className="col-12 md:col-5">
                    <label>主觀症狀 (S)</label>
                    <InputTextarea name="subjective" rows={6} value={formData.subjective} onChange={handleChange} />
                  </div>

                  <div className="col-12 md:col-5">
                    <label>客觀檢查 (O)</label>
                    <InputTextarea name="objective" rows={6} value={formData.objective} onChange={handleChange} />
                  </div>

                  <div className="col-12 md:col-5">
                    <label>專業判斷 (A)</label>
                    <InputTextarea name="assessment" rows={6} value={formData.assessment} onChange={handleChange} />
                  </div>

                  <div className="col-12 md:col-5">
                    <label>治療計畫 (P)</label>
                    <InputTextarea name="plan" rows={6} value={formData.plan} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                  <Button label="上一步" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                  <Button label="存檔" severity="success" icon="pi pi-upload" onClick={() => handleSubmit(20)} />
                  <Button label="下一步" icon="pi pi-arrow-right" iconPos="right" onClick={() => checkStep(30)} />
              </div>
            </StepperPanel>

            <StepperPanel header="檔案上傳">
              <div className="flex flex-column ">
                <div className="grid formgrid p-fluid gap-3 justify-content-center">
                  <div className="col-12 md:col-5">
                    <label>治療同意書</label>
                    <div className="flex flex-column h-15rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                          {formData.treatmentConsentFormUrl ? (
                            <Image src={imagepath+formData.treatmentConsentFormUrl} indicatorIcon={<i className="pi pi-search"></i>} alt="Image" width="100%" height="230rem" preview />
                          ) : (
                            <FileUpload
                              mode="basic"
                              name="TreatmentConsentFormUrl"
                              customUpload
                              uploadHandler={(e) => handleCustomUpload(e, 'consent')}
                              accept="image/*"
                              maxFileSize={1000000}
                              chooseLabel="選擇檔案"
                            />
                          )}
                        </div>
                    </div>
                  </div>
                    <div>

                    </div>
                  <div className="col-12 md:col-5">
                    <label>醫院診斷書</label>
                    <div className="flex flex-column h-15rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                          {formData.hospitalFormUrl ? (
                            <Image  src={imagepath+formData.hospitalFormUrl} indicatorIcon={<i className="pi pi-search"></i>} alt="Image" width="100%" height="230rem" preview />
                          ) : (
                            <FileUpload
                              mode="basic"
                              name="HospitalFormUrl"
                              customUpload
                              uploadHandler={(e) => handleCustomUpload(e, 'hospital')}
                              accept="image/*"
                              maxFileSize={1000000}
                              chooseLabel="選擇檔案"
                            />
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                  <Button label="上一步" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback()} />
                  <Button label="結案" severity="success" icon="pi pi-check" iconPos="right" onClick={() => handleSubmit(40)} />
              </div>
            </StepperPanel>
        </Stepper>
    </div>


    </div>
    
  );
};

export default TreatmentsDetailPage;