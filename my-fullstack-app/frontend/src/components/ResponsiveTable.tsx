import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  country: string;
}

interface State {
  users: User[];
  isMobile: boolean;
  loading: boolean;
}

export default class ResponsiveTable extends Component<{}, State> {
  resizeListener: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      users: [],
      isMobile: window.innerWidth < 768,
      loading: true
    };

    this.resizeListener = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    window.addEventListener("resize", this.resizeListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeListener);
  }

  handleResize() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  fetchData() {
    api.get<User[]>("/users")
      .then(res => this.setState({ users: res.data }))
      .catch(err => console.error("API error:", err))
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    const { users, isMobile, loading } = this.state;

    if (loading) {
      return (
        <div className="p-4">
          <ProgressSpinner />
        </div>
      );
    }

    if (isMobile) {
      return (
        <div className="p-4">
          {users.map(user => (
            <Card key={user.id} title={user.name} subTitle={user.country} className="mb-3">
              <p><strong>Email:</strong> {user.email}</p>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="p-4">
        <DataTable value={users} paginator rows={5} responsiveLayout="scroll">
          <Column field="id" header="ID" />
          <Column field="name" header="Name" />
          <Column field="email" header="Email" />
          <Column field="country" header="Country" />
        </DataTable>
      </div>
    );
  }
}