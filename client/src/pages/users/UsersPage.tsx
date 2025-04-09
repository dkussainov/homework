import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USERS } from "../../entities/user/api/userOperations";
import { useUserStore } from "../../entities/user/store";

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

import { User } from "../../entities/user/types";

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
  }, [getUsersData, setUsers]);

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
      cellRenderer: (params) => {
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
    <div style={{ height: "400px", width: "100%" }}>
      <h1>Users</h1>
      <AgGridReact
        theme={themeBalham}
        columnDefs={columnDefs as any} // Casting to any to resolve the type mismatch
        rowData={users} // Zustand state passed as rowData
        pagination={true} // Enable pagination
        paginationPageSize={10} // Set pagination page size
        paginationPageSizeSelector={[10, 20, 50, 100]} // Add 10 to the selector options
        domLayout="autoHeight" // Auto height for rows
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
  );
};

export default UsersPage;
