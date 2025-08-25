/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import type { TableColumnsType } from "antd";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  getPaginatedEmployeesQueryOptions,
  useDeleteEmployee,
  useUpdateEmployee,
} from "../services/EmployeeService";
import { Employee } from "../type/type";

const TableComponent: React.FC = () => {
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 7,
  });

  const { data, isLoading } = useQuery(
    getPaginatedEmployeesQueryOptions(pagination.page, pagination.pageSize)
  );
  console.log("data:", data);
  const employeesData = data?.data || [];
  const totalRecords = data?.totalRecords || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Employee | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = (record: Employee) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };
  const updateEmployee = useUpdateEmployee({
    mutationConfig: {
      onSuccess: () => {
        messageApi.success({
          content: "You updated the employee successfully!",
          duration: 3,
        });
      },
      onError: (error: any) => {
        messageApi.error({
          content:
            error?.response?.data?.message || "Failed to update employee",
          duration: 3,
        });
      },
    },
  });

  const deleteEmployee = useDeleteEmployee({
    mutationConfig: {
      onSuccess: () => {
        messageApi.success({
          content: "Employee deleted successfully!",
          duration: 3,
        });
      },
      onError: (error: any) => {
        messageApi.error({
          content:
            error?.response?.data?.message || "Failed to delete employee",
          duration: 3,
        });
      },
    },
  });

  React.useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        fullname: selectedRecord.fullName,
        email: selectedRecord.email,
        dateOfBirth: selectedRecord.dateOfBirth
          ? dayjs(selectedRecord.dateOfBirth)
          : undefined,
        phoneNumber: selectedRecord.phoneNumber,
        gender: selectedRecord.gender,
      });
    } else {
      form.resetFields();
    }
  }, [selectedRecord, form]);

  const handleOk = () => {
    if (selectedRecord?.id) {
      updateEmployee.mutate({
        id: selectedRecord?.id,
        data: {
          fullName: form.getFieldValue("fullname"),
          // email: form.getFieldValue("email"),
          dateOfBirth: form.getFieldValue("dateOfBirth"),
          phoneNumber: form.getFieldValue("phoneNumber"),
          gender: form.getFieldValue("gender"),
          // password: form.getFieldValue("password"),
        },
      });
      setSelectedRecord(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteEmployee = (id: number) => {
    deleteEmployee.mutate(id);
  };
  const handleCancel = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  const columns: TableColumnsType<Employee> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "volcano"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: (
                  <Button onClick={() => showModal(record)} type="text">
                    Edit
                  </Button>
                ),
              },
              {
                key: "delete",
                label: (
                  <Popconfirm
                    title="Are you sure to delete this employee?"
                    onConfirm={() => {
                      handleDeleteEmployee(record.id);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                ),
              },
            ],
          }}
        >
          <Button>Actions</Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", width: "80%" }}>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={employeesData}
        loading={isLoading}
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.page + 1,
          total: totalRecords,
          onChange: (page, pageSize) => {
            setPagination({
              page: page - 1,
              pageSize: pageSize,
            });
          },
        }}
        rowKey="id"
      />
      <Modal
        title="Edit Employee"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedRecord && (
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
          >
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[
                { required: true, message: "Please input your fullname!" },
                {
                  min: 4,
                  message: "Fullname must be at least 4 characters long!",
                },
                {
                  max: 160,
                  message: "Fullname must be at most 160 characters long!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Date of Birth" name="dateOfBirth">
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
                {
                  pattern: /^\d{10}$/,
                  message: "Phone number must be 10 digits long!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
              <Select>
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item> */}

            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                onClick={handleOk}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default TableComponent;
