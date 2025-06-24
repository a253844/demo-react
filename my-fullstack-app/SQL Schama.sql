INSERT INTO MenuGroups ( Name , SortOrder) VALUES
  ('治療相關', 0, 'pi pi-user-edit'),
  ('病患管理', 1, 'pi pi-users'),
  ('系統管理', 2, 'pi pi-server');
  
  INSERT INTO Menus (Path, Name, Disabled, GroupId) VALUES
  -- 群組 1: 治療相關
  ('/doctors', '治療師列表', FALSE, 1),
  ('/doctordetail', '治療師詳情', FALSE, 1),
  ('/schedules', '排班表', FALSE, 1),

  -- 群組 2: 病患管理
  ('/medical_records', '診療紀錄', FALSE, 2),
  ('/patients', '病患列表', FALSE, 2),
  ('/patientsdetail', '病患詳情', FALSE, 2),
  ('/treatment_costs', '診療費用', FALSE, 2),

  -- 群組 3: 系統管理
  ('/users', '後台用戶', FALSE, 3);