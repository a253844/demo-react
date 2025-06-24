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

INSERT INTO Users (Name, Username, PasswordHash) VALUES
('系統管理員', 'Admin', '$2a$11$BzHelCHTnyZ1YaBmntBbF.fYiWnxD6vmluEYHficTzB1cBEhEIc9a')

INSERT INTO DataTypes (Number, Name, IsEnabled, CreatedAt, UpdatedAt) VALUES
('100', '正背面', true, NOW(), NOW()),
('101', '正面左邊', true, NOW(), NOW()),
('102', '正面右邊', true, NOW(), NOW()),
('103', '背面左邊', true, NOW(), NOW()),
('104', '背面右邊', true, NOW(), NOW()),

('200', '不適部位', true, NOW(), NOW()),
('201', '頭頸部', true, NOW(), NOW()),
('202', '胸肋部', true, NOW(), NOW()),
('203', '腰臀部', true, NOW(), NOW()),
('204', '間肘手部', true, NOW(), NOW()),
('205', '腿膝足部', true, NOW(), NOW()),
('206', '肢體活動控制受限', true, NOW(), NOW()),

('300', '不適情形', true, NOW(), NOW()),
('301', '用力即有拉扯感或刺痛', true, NOW(), NOW()),
('302', '隱約疲頓感不動也痛', true, NOW(), NOW()),
('303', '脹麻感', true, NOW(), NOW()),
('304', '無法敘述的不適感', true, NOW(), NOW()),
('305', '活動受限', true, NOW(), NOW()),

('400', '不適期間', true, NOW(), NOW()),
('401', '0-2周', true, NOW(), NOW()),
('402', '2周-2個月', true, NOW(), NOW()),
('403', '2個月-6個月', true, NOW(), NOW()),
('404', '6個月-12個月', true, NOW(), NOW()),
('405', '12個月以上', true, NOW(), NOW()),

('500', '可能引發的原因', true, NOW(), NOW()),
('501', '運動後或明確跌撞傷', true, NOW(), NOW()),
('502', '疑似長時間固定姿勢', true, NOW(), NOW()),
('503', '姿勢不良或器具使用不當', true, NOW(), NOW()),
('599', '其他', true, NOW(), NOW()),

('600', '曾接受過相關處置', true, NOW(), NOW()),
('601', '西醫針劑治療', true, NOW(), NOW()),
('602', '西醫健保復健', true, NOW(), NOW()),
('603', '中醫藥或針灸', true, NOW(), NOW()),
('604', '西醫徒手治療或中醫推拿', true, NOW(), NOW()),
('605', '按摩整骨相關', true, NOW(), NOW()),
('699', '其他', true, NOW(), NOW()),

('700', '如何知道我們院所', true, NOW(), NOW()),
('701', '親友介紹', true, NOW(), NOW()),
('702', '地圖搜尋', true, NOW(), NOW()),
('703', '網頁搜尋或網路評價', true, NOW(), NOW()),
('704', '路過門口招牌', true, NOW(), NOW()),
('705', '相關院所轉介', true, NOW(), NOW()),
('799', '其他', true, NOW(), NOW()),

('800', '系統性疾病史', true, NOW(), NOW()),
('801', '心臟病', true, NOW(), NOW()),
('802', '高血壓', true, NOW(), NOW()),
('803', '骨質疏鬆症', true, NOW(), NOW()),
('804', '糖尿病', true, NOW(), NOW()),
('805', '腦出/缺血(中風)', true, NOW(), NOW()),
('806', '巴金森氏症', true, NOW(), NOW()),
('899', '其他', true, NOW(), NOW());
