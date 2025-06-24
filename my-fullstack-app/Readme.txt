docker-compose up --build

DB 
pw
root		example
AdminUser	1qaz1232wsx4563edc

backend 
Migration 
dotnet ef migrations add InitialCreate 		(專案第一次建立)
dotnet ef migrations add add<TableName> 		(新增表)
dotnet ef migrations add add<TableName><coloum> (新增欄位)
dotnet ef database update

frontend
npm start (.env.development)
npm run build (.env.production)