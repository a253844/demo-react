import { useEffect, useState } from "react";
import api from '../services/api';
import internal from "stream";

// 定義 UserRole 中每筆物件型別
interface UserRole {
  userId: number;
  userName: string;
  roleId: number;
  roleName: string;
}

export default function useUser(
    RoleId: number
) {
  const [userRole, setuserRole] = useState<UserRole[]>([]);
  const [Roleloading, setRoleloading] = useState(true);

  useEffect(() => {

    api.get<UserRole[]>("/api/doctors/GetList", {
        params: {
          UserName: "",
          RoleId: RoleId,
        },
      })
      .then(res => setuserRole(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setRoleloading(false));
    }, []);

  return { userRole, Roleloading };
}