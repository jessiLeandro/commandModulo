import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Redirect } from "react-router-dom";
import { Dropdown, Button, Menu, Layout } from "antd";

import DividerProfile from "../Components/DividerProfile";
import { Logout } from "../Pages/Login/LoginRedux/action";
import MainPage from "../Pages/Main";
import "./index.css";

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const { Header, Content, Footer } = Layout;
class PrivateRoute extends Component {
  state = {
    display: "none",
    redirect: false,
    visibleDividerProfile: false,
    visibleDropdown: false,
    dropdownClicked: false,
    mouseEnter: false,
  };

  menu = () => (
    <Menu id="menu-user">
      <Menu.Item
        onClick={() =>
          this.setState({
            visibleDividerProfile: true,
            visibleDropdown: false,
            mouseEnter: false,
          })
        }
      >
        <p>Perfil</p>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={this.logout}>
        <p id="div-block-logout">
          Sair
          <LogoutOutlined id="icon-logout" />
        </p>
      </Menu.Item>
    </Menu>
  );

  logout = async () => {
    await this.setState({ redirect: true });
    await this.props.Logout();
  };

  render() {
    return (
      <Layout
        className="site-layout"
        onClick={async () => {
          await timeout(10);
          if (!this.state.redirect) {
            await this.setState({
              visibleDropdown: this.state.dropdownClicked ? true : false,
              dropdownClicked: false,
            });
          }
        }}
      >
        {this.state.redirect && <Redirect to="/login" />}

        <DividerProfile
          visible={this.state.visibleDividerProfile}
          onClose={() => this.setState({ visibleDividerProfile: false })}
        />
        <Header style={{ height: "50px", padding: 0, zIndex: "1" }}>
          <div className="div-navBar">
            <h1>Connecta Modulos</h1>

            <Dropdown
              visible={this.state.visibleDropdown || this.state.mouseEnter}
              overlay={this.menu}
              placement="bottomRight"
              arrow
              onMouseEnter={() => this.setState({ mouseEnter: true })}
            >
              <Button
                id="button-user-dropdwon"
                onClick={async () => {
                  await this.setState({
                    dropdownClicked: true,
                  });
                }}
              >
                <UserOutlined />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ overflow: "initial" }}>
          <DndProvider backend={HTML5Backend}>
            <div
              className="site-layout-background"
              onMouseEnter={() => this.setState({ mouseEnter: false })}
              style={{
                padding: 24,
                textAlign: "center",
                minHeight: "calc(100vh - 120px)",
              }}
            >
              <Switch>
                <Route path="/logged" component={MainPage} />
              </Switch>
            </div>
          </DndProvider>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "rgba(102, 102, 102, 0.2)",
          }}
        >
          © DEVELOPED BY JESSI LEANDRO AND GUILHERME STAIN
        </Footer>
      </Layout>
    );
  }
}

function mapDispacthToProps(dispach) {
  return bindActionCreators({ Logout }, dispach);
}

export default connect(null, mapDispacthToProps)(PrivateRoute);
