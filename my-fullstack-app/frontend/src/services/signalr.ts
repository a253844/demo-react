import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(process.env.REACT_APP_API_URL + "/reportHub")
  .withAutomaticReconnect()
  .build();

export default connection;