import { useEffect, useState } from "react";
import axios from "axios";
import api from '../services/api';

// 定義 MenuItem 中每筆物件的型別
interface MenuItem {
  itemId: string;
  path: string;
  name: string;
  disabled: boolean;
}

// 定義 MenuGroupItem 中每筆物件型別
interface MenuGroupItem {
  groupId: string;
  groupName: string;
  groupIcon: string;
  menus: MenuItem[];
}

export default function useMenu() {
  const [menu, setMenu] = useState<MenuGroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<MenuGroupItem[]>("/api/system/GetMenus")
      .then(res => setMenu(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return { menu, loading };
}