import { DatePicker, Form, Input, message, Modal, Select } from "antd";
import { useAddEmployee } from "../services/EmployeeService";
import { CreateEmployee } from "../type/type";

export function ModalAdd({ isModalAdd, setIsModalAdd }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const addMutation = useAddEmployee({
    mutationConfig: {
      onSuccess: () => {
        setIsModalAdd(false);
        form.resetFields();
        messageApi.success({
          content: "Employee added successfully",
          duration: 3,
        });
      },
      onError: (error: any) => {
        messageApi.error({
          content: error?.response?.data?.message || "Failed to add employee",
          duration: 3,
        });
      },
    },
  });
  const handleAddOk = () => {
    console.log("Form Values:", form.getFieldsValue());
    addMutation.mutate({
      fullName: form.getFieldValue("fullName"),
      email: form.getFieldValue("email"),
      dateOfBirth: form.getFieldValue("dateOfBirth"),
      gender: form.getFieldValue("gender"),
      phoneNumber: form.getFieldValue("phoneNumber"),
      password: form.getFieldValue("password"),
    } as CreateEmployee);
  };

  const handleAddCancel = () => {
    setIsModalAdd(false);
  };

  return (
    <Modal
      title="Add Employee"
      open={isModalAdd}
      onOk={handleAddOk}
      onCancel={handleAddCancel}
      closable={{ "aria-label": "Custom Close Button" }}
    >
      {contextHolder}
      <Form
        form={form}
        name="addEmployee"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item
          label="Fullname"
          name="fullName"
          rules={[
            { required: true, message: "Please input fullname!" },
            { min: 4, message: "Fullname must be at least 4 characters!" },
            { max: 160, message: "Fullname must be at most 160 characters!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Please select date of birth!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input phone number!" },
            {
              pattern: /^\d{10}$/,
              message: "Phone number must be 10 digits!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select>
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
            <Select.Option value="OTHER">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}
