import { useState, useEffect } from "react";
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
  themeQuartz,
} from "ag-grid-community";

import { Card, Button, Tag, Tooltip } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import AddUserModal from "../../features/user-form/user/addUserModal";
import EditUserModal from "../../features/user-form/user/editUserModal";
import DeleteUserButton from "../../features/user-form/user/deleteUserModal";
import Loading from "../../shared/ui/loading";
import dayjs from "dayjs";

const myTheme = themeQuartz.withParams({
  accentColor: "#1DA57A",
  backgroundColor: "#F2F1F1",
  browserColorScheme: "light",
  foregroundColor: "#36677B",
  headerFontSize: 14,
});
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

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  if (getUsersLoading) return <Loading />;
  if (getUsersError) return <p>Error: {getUsersError.message}</p>;

  const columnDefs = [
    {
      headerName: "ID",
      field: "id",
      sortable: false,
      filter: false,
      minWidth: 10,
      maxWidth: 30,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: false,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Email",
      field: "email",
      sortable: false,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      filter: true,
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params: any) => {
        const role = params.value;
        let icon;
        if (role === "admin") {
          icon = "👑";
        } else if (role === "user") {
          icon = "👤";
        } else if (role === "moderator") {
          icon = "🛡️";
        }
        return (
          <div>
            {icon} {role}
          </div>
        );
      },
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      minWidth: 50,
      maxWidth: 300,
      cellRenderer: (params: any) => {
        const status = params.value;
        let color = "";
        if (status === "active") {
          color = "green";
        } else if (status === "banned") {
          color = "red";
        } else if (status === "pending") {
          color = "yellow";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      headerName: "Date of Birth",
      field: "birthdate",
      sortable: true,
      filter: true,
      minWidth: 100,
      flex: 1,
      valueFormatter: (params: any) =>
        dayjs(params.value).format("DD.MM.YYYY, HH:mm"),
      cellRenderer: (params: any) => {
        const isoDate = dayjs(params.value).toISOString();
        return (
          <Tooltip title={isoDate} mouseEnterDelay={0.5}>
            <span>{dayjs(params.value).format("DD.MM.YYYY, HH:mm")}</span>
          </Tooltip>
        );
      },
    },
    {
      headerName: "Actions",
      field: "id",
      minWidth: 100,
      maxWidth: 300,
      cellRenderer: (params: { data: User }) => {
        const user = params.data as User;
        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              type="dashed"
              onClick={() => handleEditClick(user)}
              icon={<EditTwoTone />}
              shape="circle"
              size="small"
              style={{ color: "#1DA57A" }}
            />
            <DeleteUserButton userId={user.id} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Card title="Users" extra={<AddUserModal />}>
        <div
          className="ag-theme-alpine"
          style={{
            flex: 1, // Ensures the grid container grows to take available space
            width: "100%", // Takes full width of the parent container
            minHeight: "400px", // Ensures the grid has a minimum height
            overflow: "hidden", // Prevents content overflow
          }}
        >
          <AgGridReact
            key={users.length}
            theme={myTheme}
            columnDefs={columnDefs as any}
            rowData={users}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            domLayout="autoHeight" // Automatically adjusts grid height based on content
            modules={[
              ClientSideRowModelModule,
              PaginationModule,
              TextFilterModule,
              NumberFilterModule,
              DateFilterModule,
              ValidationModule,
            ]}
            // Auto resize columns to fit container width
            gridOptions={{
              suppressColumnVirtualisation: true, // Disable column virtualization for responsiveness
            }}
          />
        </div>
      </Card>

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UsersPage;
