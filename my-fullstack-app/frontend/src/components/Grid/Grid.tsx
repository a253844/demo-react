import React, { Component, ReactNode } from 'react';
import GridItem from '../Item/GridItem';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import api from '../../services/api';

// 定義資料列的型別
interface Doctor {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
}

// 定義欄位名稱的型別
interface ColNameItem {
  name: string;
}

// 定義 RowCount 的型別
interface RowCount {
  current: number;
  total: number;
}

// 定義元件 state 型別
interface GridState {
  doctors: Doctor[];
  colName: ColNameItem[];
  rowCount: RowCount;
  isMobile: boolean;
  loading: boolean;
}



// 無 props，所以用 {} 型別
export default class Grid extends Component<{}, GridState> {
resizeListener: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      doctors: [],
      colName: [],
      rowCount: {
        current: 1,
        total: 0
      },
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
    api.get<Doctor[]>("/api/users/doctors")
      .then(res => this.setState({ doctors: res.data }))
      .catch(err => console.error("API error:", err))
      .finally(() => this.setState({ loading: false }));
  }

  render(): ReactNode {
    const { doctors, isMobile, loading } = this.state;
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

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
          {doctors.map(doctor => (
            <Card key={doctor.id} title={doctor.firstname} subTitle={doctor.lastname} className="mb-3">
              <p><strong>username:</strong> {doctor.username}</p>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="card">
        <DataTable
          value={doctors}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30, 40]}
          tableStyle={{ minWidth: '50rem' }}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
        >
          <Column field="id" header="id" style={{ width: '25%' }} />
          <Column field="firstname" header="firstname" style={{ width: '25%' }} />
          <Column field="lastname" header="lastname" style={{ width: '25%' }} />
          <Column field="username" header="username" style={{ width: '25%' }} />
        </DataTable>
      </div>
    );
  }
}