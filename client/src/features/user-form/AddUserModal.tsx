import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../entities/user/api/userOperations";
import { useUserStore } from "../../entities/user/store";

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
import { UserAddOutlined } from "@ant-design/icons";

const roles = ["admin", "user", "moderator"];
const statuses = ["active", "banned", "pending"];

const AddUserModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addUserMutation] = useMutation(CREATE_USER);
  const [form] = Form.useForm();

  const { addUser } = useUserStore();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: {
    name: string;
    email: string;
    role: string;
    status: string;
    birthdate: any;
  }) => {
    setConfirmLoading(true);

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
      const { data } = await addUserMutation({
        variables: userData,
      });

      if (data) {
        addUser(data.createUser);

        notification.success({
          message: "User Added Successfully!",
          description: `User ${data.createUser.name} has been added.`,
        });
        form.resetFields();
        setOpen(false);
      }
    } catch (error) {
      notification.error({
        message: "Error Adding User",
        description:
          "There was an error while adding the user. Please try again.",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} shape="circle">
        <UserAddOutlined style={{ color: "#FFFFFF" }} />
      </Button>

      <Modal
        title="Add New User"
        open={open}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        footer={null}
        centered
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: roles[1],
            status: statuses[0],
            birthdate: null,
          }}
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
