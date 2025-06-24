import { useEffect, useState } from "react";
import api from '../services/api';

// 定義 MenuItem 中每筆物件的型別
interface MenuItem {
  itemId: string;
  path: string;
  name: string;
  isEnabled: boolean;
}

// 定義 MenuGroupItem 中每筆物件型別
interface MenuGroupItem {
  groupId: string;
  groupName: string;
  groupIcon: string;
  menus: MenuItem[];
}

export default function useMenu(isAuth: boolean) {
  const [menu, setMenu] = useState<MenuGroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!isAuth){
        setLoading(false);
        return;
    }

    api.get<MenuGroupItem[]>("/api/system/GetMenus")
      .then(res => setMenu(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
    }, [isAuth]);

  return { menu, loading };
}