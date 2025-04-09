import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../../entities/user/api/userOperations";
import { useUserStore } from "../../entities/user/store";
import { User } from "../../entities/user/types";

import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  themeBalham,
} from "ag-grid-community";

import { Card } from "antd";
import AddUserModal from "../../features/user-form/user/addUserModal";

const UsersPage: React.FC = () => {
  const {
    data: getUsersData,
    loading: getUsersLoading,
    error: getUsersError,
  } = useQuery(GET_USERS);

  const { users, setUsers } = useUserStore();

  useEffect(() => {
    if (getUsersData) {
      setUsers(getUsersData.getUsers);
    }
  }, [getUsersData, setUsers, users]);

  if (getUsersLoading) return <p>Loading...</p>;
  if (getUsersError) return <p>Error: {getUsersError.message}</p>;

  const columnDefs = [
    { headerName: "ID", field: "id", sortable: true, filter: true },
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Role", field: "role", sortable: true, filter: true },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    {
      headerName: "Date of Birth",
      field: "birthdate",
      sortable: true,
      filter: true,
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params: { data: User }) => {
        const user = params.data as User;
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => console.log(user)}>Edit</button>
            <button onClick={() => console.log(user.id)}>Delete</button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card title="Users" extra={<AddUserModal />}>
        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            theme={themeBalham}
            columnDefs={columnDefs as any}
            rowData={users} // Zustand state passed as rowData
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            domLayout="autoHeight"
            modules={[
              ClientSideRowModelModule,
              PaginationModule,
              TextFilterModule,
              NumberFilterModule,
              DateFilterModule,
              ValidationModule,
            ]}
          />
        </div>
      </Card>
    </>
  );
};

export default UsersPage;
