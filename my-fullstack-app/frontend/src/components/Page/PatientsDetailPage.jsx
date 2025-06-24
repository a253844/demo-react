import React, { useState }from 'react';
import InputItem from '../Item/InputItem'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import CalendarItem from '../Item/CalendarItem'
import { InputMask } from "primereact/inputmask";
import { Dropdown } from 'primereact/dropdown';

export default function  PatientsDetailPage() {  

  const [PatientNo, setPatientNo] = useState(null);
  const [First_name, setFirst_name] = useState(null);
  const [Last_name, setLast_name] = useState(null);
  const [Address, setAddress] = useState(null);
  const [Eamil, setEamil] = useState(null);
  const [Phone, setPhone] = useState(null);
  const [Age, setAge] = useState(null);
  const [Gender, setGender] = useState(null);

  const  Genders = [
        { name: '男', code: 'M' },
        { name: '女', code: 'W' }
      ]

    return (
        <div>
                  <div className="card flex flex-wrap gap-3 p-fluid">
                    <InputItem Label={"病患姓名"}></InputItem>
                    <div>
                      <Button label="查詢" icon="pi pi-search" />
                    </div>
                  </div>
                  <div className="card flex flex-wrap gap-3 p-fluid">
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              病患編號
                          </label>
                          <InputText id="userno" value={PatientNo} onChange={(e) => setPatientNo(e.target.value)} />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              姓
                          </label>
                          <InputText id="userno" value={First_name} onChange={(e) => setFirst_name(e.target.value)} />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              名
                          </label>
                          <InputText id="userno" value={Last_name} onChange={(e) => setLast_name(e.target.value)} />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              生日
                          </label>
                          <CalendarItem Label={""}></CalendarItem>
                      </div>
                  </div>
                  <div className="card flex flex-wrap gap-3 p-fluid">
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              聯絡電話
                          </label>
                          <InputMask value={Phone} onChange={(e) => setPhone(e.target.value)} mask="(99)9999-9999" placeholder="(02)1234-5678" />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              聯絡手機
                          </label>
                          <InputMask value={Phone} onChange={(e) => setPhone(e.target.value)} mask="(99)99-999-999" placeholder="(09)00-123-456" />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              年齡
                          </label>
                          <InputText id="userno" value={Age} onChange={(e) => setAge(e.target.value)} />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              初次診療時間
                          </label>
                          <CalendarItem Label={""}></CalendarItem>
                      </div>
                  </div>
                  <div className="card flex flex-wrap gap-3 p-fluid">
                      <div className="flex-auto">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              居住地址
                          </label>
                          <InputText id="userno" value={Address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div className="flex-1">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              電子郵件
                          </label>
                          <InputText id="userno" value={Eamil} onChange={(e) => setEamil(e.target.value)} placeholder="123@abc.com"/>
                      </div>
                      <div className="flex-auto">
                          <label htmlFor="buttondisplay" className="font-bold block mb-2">
                              性別
                          </label>
                          <div className="card flex justify-content-center">
                            <Dropdown value={Gender} onChange={(e) => setGender(e.value)} options={Genders} optionLabel="name" 
                                placeholder="選擇性別" className="w-full md:w-14rem" />
                          </div>
                      </div>
                  </div>
                </div>
                
    )
}