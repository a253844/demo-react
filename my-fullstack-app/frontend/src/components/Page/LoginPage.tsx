import { useRef,useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
      navigate('/');
    } catch (err) {
      toast.current?.show({
          severity: "error",
          summary: "登入失敗",
          detail: String(err),
      });
    }
  };

  useEffect(() => {
    if(!!localStorage.getItem('token')){
      navigate('/');
    }

  });


  return (
    <div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
      <Toast ref={toast} />
      <Card title="厝邊頭家物理治療所" subTitle="後台系統" className="w-25rem">
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="username" className="block mb-2">帳號</label>
            <InputText
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="輸入帳號"
            />
          </div>
          <div className="field mb-4">
            <label htmlFor="password" className="block mb-2">密碼</label>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入密碼"
            />
          </div>
          <Button label="登入" onClick={handleLogin} className="w-full" />
        </div>
      </Card>
    </div>
  );
}