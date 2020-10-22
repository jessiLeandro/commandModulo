import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.css";

import { Button, Drawer, Form, Row, Input, Divider, message } from "antd";

import { createUser, updatePassword } from "../../service/user";

const NewAccountForm = () => {
  const [form] = Form.useForm();

  const CreateUser = async (value) => {
    const { status, data } = await createUser(value);

    if (status === 200) {
      form.resetFields();
      message.success("Novo usuário cadastrado com sucesso");
    } else if (status === 422) {
      message.error(`Erro: status ${status}`);
      const setFields = data.fields.map((item, idx) => {
        return {
          name: [item],
          errors: [data.messages[idx]],
        };
      });

      form.setFields(setFields);
    } else {
      message.error(`Erro: status ${status}`);
      console.log(data);
    }
  };

  return (
    <Form
      form={form}
      name="NewAccountForm"
      className="ant-advanced-search-form"
      layout="vertical"
      hideRequiredMark
      onFinish={(value) => CreateUser(value)}
    >
      <Row gutter={16}>
        <Form.Item
          name="username"
          label="Usuário"
          rules={[{ required: true, message: "Por favor digite um usuário" }]}
          style={{ width: "100%" }}
        >
          <Input placeholder="digite um usuário" />
        </Form.Item>
      </Row>
      <Row gutter={16}>
        <Form.Item
          name="password"
          label="Senha"
          rules={[{ required: true, message: "Por favor digite uma senha" }]}
          style={{ width: "100%" }}
        >
          <Input.Password placeholder="digite uma senha" />
        </Form.Item>
      </Row>
      <Row justify="end">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};

const UpdatePasswordForm = (props) => {
  const [form] = Form.useForm();

  const UpdatePassword = async (value) => {
    const { status, data } = await updatePassword({
      ...value,
      id: props.user.id,
      username: props.user.username,
    });

    console.log(status, data);
    if (status === 200) {
      form.resetFields();
      message.success("Senha atualizada sucesso");
    } else if (status === 422) {
      message.error(`Erro: status ${status}`);
      const setFields = data.fields.map((item, idx) => {
        return {
          name: [item],
          errors: [data.messages[idx]],
        };
      });
      form.setFields(setFields);
    } else {
      message.error(`Erro: status ${status}`);
      console.log(data);
    }
  };

  return (
    <Form
      form={form}
      className="ant-advanced-search-form"
      layout="vertical"
      name="UpdatePasswordForm"
      hideRequiredMark
      onFinish={(value) => UpdatePassword(value)}
    >
      <Row gutter={16}>
        <Form.Item
          name="password"
          label="Senha"
          rules={[{ required: true, message: "Por favor digite uma senha" }]}
          style={{ width: "100%" }}
        >
          <Input.Password placeholder="digite uma senha" />
        </Form.Item>
      </Row>
      <Row gutter={16}>
        <Form.Item
          name="newPassword"
          label="Nova senha"
          rules={[{ required: true, message: "Por favor digite uma senha" }]}
          style={{ width: "100%" }}
        >
          <Input.Password placeholder="digite uma senha" />
        </Form.Item>
      </Row>
      <Row gutter={16}>
        <Form.Item
          name="confirfNewPassword"
          label="Confirme"
          rules={[
            {
              required: true,
              message: "Por favor digite uma senha",
            },
          ]}
          style={{ width: "100%" }}
        >
          <Input.Password placeholder="digite uma senha" />
        </Form.Item>
      </Row>

      <Row justify="end">
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Confirmar
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};

// const [form] = Form.useForm();
class DividerProfile extends Component {
  constructor(pros) {
    super(pros);

    this.state = {
      chips: [],
    };
  }

  render() {
    return (
      <Drawer
        title="Perfil"
        width={360}
        onClose={this.props.onClose}
        visible={this.props.visible}
        // bodyStyle={{ paddingBottom: 80 }}
        className="Drawer-profile"
        footer={null}
      >
        <h3>
          <strong>User: </strong>
          {this.props.login.user.username}
        </h3>
        <Divider>Editar senha</Divider>

        <UpdatePasswordForm user={this.props.login.user} />

        {this.props.login.user.username === "admin" && (
          <>
            <Divider>New account</Divider>
            <NewAccountForm />
          </>
        )}
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps)(DividerProfile);
