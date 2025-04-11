import { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, UPDATE_USER } from "../../entities/user/api/userOperations";
import { useUserStore } from "../../entities/user/store";
import { User } from "../../entities/user/types";

import AddUserModal from "../../features/user-form/AddUserModal";
import EditUserModal from "../../features/user-form/EditUserModal";
import DeleteUserButton from "../../features/user-delete/DeleteUserModal";
import Loading from "../../shared/ui/Loading";

import { AgGridReact } from "ag-grid-react";
import { lightTheme, darkTheme } from "../../shared/config/agGridTheme";
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
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const UsersPage: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
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
      minWidth: 48,
      maxWidth: 48,
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
      flex: 1,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      filter: true,
      flex: 1,
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
      flex: 1,
      cellRenderer: (params: any) => {
        const status = params.value;
        let color = "";
        let bgColor = "";

        if (status === "active") {
          color = "#fff";
          bgColor = "#52c41a";
        } else if (status === "banned") {
          color = "#fff";
          bgColor = "#f5222d";
        } else if (status === "pending") {
          color = "#fff";
          bgColor = "#faad14";
        }

        return (
          <Tag
            color={bgColor}
            style={{
              backgroundColor: bgColor,
              color: color,
              borderRadius: "4px",
              border: "none",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      headerName: "Date of Birth",
      field: "birthdate",
      sortable: true,
      filter: true,
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
              type="default"
              onClick={() => handleEditClick(user)}
              icon={<EditOutlined />}
              shape="circle"
              size="small"
              style={{
                marginTop: "0.5rem",
                backgroundColor: "",
                borderColor: "#f0f5ff",
              }}
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
            theme={isDarkMode ? darkTheme : lightTheme}
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
