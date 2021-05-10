import React, { Component } from "react";
import "./index.css";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Redirect } from "react-router-dom";

import { login } from "../../service/session";
import { setAuth } from "./LoginRedux/action";

class LoginPage extends Component {
  state = {
    passwordVisible: false,
    username: "",
    password: "",
    fieldError: null,
    message: null,
    auth: false,
  };

  setPasswordVisible = () =>
    this.setState({ passwordVisible: !this.state.passwordVisible });

  onChange = async (e) => {
    const { name, value } = e.target;

    await this.setState({ [name]: value });
  };

  enterKey = async (e) => {
    if (e.which === 13 || e.keyCode === 13) {
      await this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    const { username, password } = this.state;

    const { status, data } = await login({ username, password });

    switch (status) {
      case 200:
        try {
          await this.props.setAuth(data);
          await promisify(jwt.verify)(data.token, "realponto#%real%");

          this.setState({ auth: true });
        } catch (err) {
          console.log(err);
        }

        break;
      case 401:
        await this.setState(data);
        break;
      default:
        console.log("status: ", status, "\nErro: ", data);
        break;
    }
  };

  render() {
    return (
      <div className="div-main-login">
        {this.state.auth && <Redirect to="/logged/" />}

        <div className="div-nuvem-1" />
        <div className="div-nuvem-2" />
        <div className="div-nuvem-3" />
        <div className="div-nuvem-4" />
        <div className="card">
          <h1>Connecta Modulos</h1>
          <div className="div-block-form">
            <div className="input-block">
              <i>
                <UserOutlined />
              </i>
              <input
                id="username"
                name="username"
                value={this.state.username}
                type="text"
                required
                onChange={this.onChange}
                onKeyPress={this.enterKey}
              />
              <label for="username">Usuário</label>
              <div className="div-border"></div>
              {this.state.fieldError === "username" && (
                <span className="span-erro">{this.state.message}</span>
              )}
            </div>

            <div className="input-block">
              <i>
                <LockOutlined />
              </i>
              <input
                id="password"
                name="password"
                value={this.state.password}
                type={this.state.passwordVisible ? "text" : "password"}
                required
                onChange={this.onChange}
                onKeyPress={this.enterKey}
              />
              <label for="password">Senha</label>
              <i>
                {this.state.passwordVisible ? (
                  <EyeInvisibleOutlined
                    onClick={this.setPasswordVisible}
                    className="icon-Eye"
                  />
                ) : (
                  <EyeOutlined
                    onClick={this.setPasswordVisible}
                    className="icon-Eye"
                  />
                )}
              </i>
              <div className="div-border"></div>
              {this.state.fieldError === "password" && (
                <span className="span-erro">{this.state.message}</span>
              )}
            </div>

            <div className="div-block-button">
              <button onClick={this.handleSubmit} className="button-logar">
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ setAuth }, dispach);
}

export default connect(null, mapDispacthToProps)(LoginPage);
