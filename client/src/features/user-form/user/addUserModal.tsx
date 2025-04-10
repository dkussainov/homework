import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  Spin,
} from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../../entities/user/api/userOperations";
import { useUserStore } from "../../../entities/user/store";

const roles = ["admin", "user", "moderator"];
const statuses = ["active", "banned", "pending"];

const AddUserModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addUserMutation] = useMutation(CREATE_USER);

  // Zustand store to update the list of users
  const { addUser } = useUserStore();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = async (values: {
    name: string;
    email: string;
    role: string;
    status: string;
    birthdate: any;
  }) => {
    setConfirmLoading(true);

    // Prepare data for GraphQL mutation
    const userData = {
      name: values.name,
      email: values.email,
      role: values.role,
      status: values.status,
      birthdate: values.birthdate
        ? values.birthdate.format("YYYY-MM-DD")
        : null,
    };

    try {
      // Make the GraphQL request to add the user
      const { data } = await addUserMutation({
        variables: userData,
      });

      console.log(data);

      // Update Zustand store with the newly added user
      if (data) {
        addUser(data.createUser);

        // Success notification
        notification.success({
          message: "User Added Successfully!",
          description: `User ${data.createUser.name} has been added.`,
        });

        // Close the modal
        setOpen(false);
      }
    } catch (error) {
      // Handle error
      notification.error({
        message: "Error Adding User",
        description:
          "There was an error while adding the user. Please try again.",
      });
    } finally {
      setConfirmLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>

      <Modal
        title="Add New User"
        open={open}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        footer={null} // We will customize the footer
        centered
        width={600}
      >
        <Form
          layout="vertical"
          onFinish={handleOk}
          initialValues={{ role: roles[1], status: statuses[0], dob: null }} // Default role, status, and dob (null initially)
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Select.Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status">
              {statuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Date of Birth (DOB) field */}
          <Form.Item
            label="Date of Birth"
            name="birthdate"
            rules={[
              { required: true, message: "Please select a date of birth!" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Select date of birth"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={confirmLoading}
              block
            >
              {confirmLoading ? <Spin /> : "Save User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserModal;
