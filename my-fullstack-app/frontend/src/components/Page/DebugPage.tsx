import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import api from "../../services/api"; 
import { InputText } from "primereact/inputtext";
import { Image } from 'primereact/image';

export default function DebugPage() {
    const toast = useRef<Toast>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [value, setValue] = useState('');

    // 上傳
    const handleCustomUpload = async (event: FileUploadHandlerEvent) => {
        const file = event.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file); // 注意：這裡的 key 要和後端接收的參數一致

        try {
            const response = await api.post("/api/system/UploadFile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.current?.show({
                severity: "success",
                summary: "成功",
                detail: "檔案已上傳",
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "錯誤",
                detail: "上傳失敗",
            });
        }
    };

    // 下載
    const handleDownload = async (fileName: string) => {
        try {
            const response = await api.get(`/api/system/DownloadFile`, {
                params: { filename: fileName },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.current?.show({
                severity: "success",
                summary: "下載完成",
                detail: fileName,
            });
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "下載失敗",
                detail: String(error),
            });
        }
    };

    // 預覽
    const handlePreview = async (fileName: string) => {
        try {
            const response = await api.get(`/api/system/DownloadFile`, {
                params: { filename: fileName },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setPreviewUrl(url);
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "預覽失敗",
                detail: String(error),
            });
        }
    };

    return (
        <div className="card flex justify-content-center">
            <div>
            <Toast ref={toast} />
            <FileUpload
                mode="basic"
                customUpload
                uploadHandler={handleCustomUpload}
                accept="image/*"
                maxFileSize={1000000}
                chooseLabel="選擇檔案"
            />
            </div>
            <div>
                <div className="flex gap-2">
                    <InputText value={value} onChange={(e) => setValue(e.target.value)} />
                    <Button label="下載" icon="pi pi-download" onClick={() =>handleDownload(value)} severity="success" />
                    <Button label="預覽" icon="pi pi-eye" onClick={() =>handlePreview(value)} severity="info" />
                </div>
            </div>
            <div>
                <div>
                    {previewUrl && (
                        <Image src={previewUrl} alt="預覽圖片" width="250" preview />
                    )}
                </div>
            </div>
        </div>
        
    );
}