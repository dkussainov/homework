import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  notification,
  Spin,
  DatePicker,
} from "antd";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../entities/user/api/userOperations";
import { User } from "../../entities/user/types";
import dayjs from "dayjs";

interface EditUserModalProps {
  open: boolean;
  onCancel: () => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onCancel,
  user,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      const validBirthdate = user.birthdate ? dayjs(user.birthdate) : null;

      if (validBirthdate && validBirthdate.isValid()) {
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          birthdate: validBirthdate,
        });
      }
    }
  }, [user, form]);

  const handleOk = async (values: any) => {
    setConfirmLoading(true);
    try {
      const formattedBirthdate =
        values.birthdate && values.birthdate.isValid()
          ? values.birthdate.format("YYYY-MM-DD")
          : null;

      const { data } = await updateUserMutation({
        variables: {
          id: user?.id,
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          birthdate: formattedBirthdate,
        },
      });

      notification.success({
        message: "User Updated",
        description: `User ${data.updateUser.name} has been updated successfully!`,
      });

      onCancel();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "There was an error updating the user. Please try again.",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Edit User"
      open={open}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleOk}
        initialValues={{
          name: user?.name,
          email: user?.email,
          role: user?.role,
          status: user?.status,
          birthdate: user?.birthdate ? dayjs(user.birthdate) : null,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="moderator">Moderator</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status!" }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="banned">Banned</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Birthdate"
          name="birthdate"
          rules={[{ required: true, message: "Please select a birthdate!" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={confirmLoading}
          >
            {confirmLoading ? <Spin /> : "Save Changes"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
