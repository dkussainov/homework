import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, UPDATE_USER } from "../../entities/user/api/userOperations";
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
  SelectEditorModule,
} from "ag-grid-community";

import { Card, Button, Tag, Tooltip, notification } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import AddUserModal from "../../features/user-form/AddUserModal";
import EditUserModal from "../../features/user-form/EditUserModal";
import DeleteUserButton from "../../features/user-delete/DeleteUserModal";
import Loading from "../../shared/ui/Loading";
import dayjs from "dayjs";
import { myTheme } from "../../shared/config/agGridTheme";

const UsersPage: React.FC = () => {
  const {
    data: getUsersData,
    loading: getUsersLoading,
    error: getUsersError,
  } = useQuery(GET_USERS);

  const [updateUserMutation] = useMutation(UPDATE_USER);

  const { users, setUsers, editUser } = useUserStore();

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

  const handleUpdateUser = async (user: User) => {
    try {
      const { data } = await updateUserMutation({
        variables: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          birthdate: user.birthdate,
        },
      });

      notification.success({
        message: "User Updated",
        description: `User ${data.updateUser.name} has been updated successfully!`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "There was an error updating the user. Please try again.",
      });
    }
  };

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
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["👑admin", "👤user", "🛡️moderator"],
      },
      valueSetter: (params: any) => {
        const updatedUser = { ...params.data, role: params.newValue };
        editUser(updatedUser);
        console.log(updatedUser);
        handleUpdateUser(updatedUser);
      },

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
      <Card title="Registered Users" extra={<AddUserModal />}>
        <div
          className="ag-theme-alpine"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "400px",
            overflow: "hidden",
          }}
        >
          <AgGridReact
            theme={myTheme}
            columnDefs={columnDefs as any}
            rowData={users}
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
              SelectEditorModule,
            ]}
            gridOptions={{
              suppressColumnVirtualisation: true,
            }}
            getRowId={(params) => params.data.id}
            singleClickEdit={true}
          />
        </div>
      </Card>

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
