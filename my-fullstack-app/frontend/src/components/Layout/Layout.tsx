import React from 'react';
import { Outlet, useNavigate } from "react-router-dom";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";

interface MenuItemData {
  itemId: string;
  path: string;
  name: string;
  isEnabled: boolean;
}

interface MenuGroupItem {
  groupId: string;
  groupName: string;
  groupIcon: string;
  menus: MenuItemData[];
}

interface LayoutProps {
  MenuGroup: MenuGroupItem[];
}

const Layout: React.FC<LayoutProps> = ({ MenuGroup }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    alert("已登出");
    navigate("/login");
  };

  const HeaderItems:MenuItem[] = [
    {
      label: "首頁",
      icon: "pi pi-home",
      url: "/"
    }
  ];

  // 建立群組選單
  MenuGroup.forEach((group) => {
    const templist = group.menus
      .filter((data) => data.isEnabled)
      .map((data) => ({
        key: data.itemId,
        label: data.name,
        url: data.path
      }));

    HeaderItems.push({
      label: group.groupName,
      icon: group.groupIcon,
      items: templist
    });
  });

  const HeaderEndItems = (
    <div className="flex align-items-center gap-2">
      <label className="font-bold block mb-2">醫生您好</label>
      <Button
        icon="pi pi-sign-out"
        label="登出"
        className="p-button-text"
        onClick={logout}
      />
    </div>
  );

  return (
    <div className="layout-wrapper">
      <Menubar model={HeaderItems} end={HeaderEndItems} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;