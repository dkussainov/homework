import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../entities/user/api/userOperations";
import { useUserStore } from "../../entities/user/store";

import { Button, Modal, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const DeleteUserButton: React.FC<{ userId: string }> = ({ userId }) => {
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const { removeUser } = useUserStore();

  const confirmDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const { data } = await deleteUserMutation({
            variables: { id: userId },
          });

          if (data) {
            removeUser(userId);

            notification.success({
              message: "User Deleted Successfully",
              description: "The user has been deleted.",
            });
          }
        } catch (error) {
          notification.error({
            message: "Error Deleting User",
            description:
              "There was an error while deleting the user. Please try again.",
          });
        }
      },
    });
  };

  return (
    <Button
      danger
      onClick={confirmDelete}
      shape="circle"
      size="small"
      icon={<DeleteOutlined />}
      style={{
        color: "#1DA57A",
        backgroundColor: "",
        borderColor: "#f0f5ff",
        boxShadow: "none",
        marginTop: "0.5rem",
      }}
    />
  );
};

export default DeleteUserButton;
