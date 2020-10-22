import React, { Component } from "react";
import "./index.css";
import { Modal } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";

class ModalCommand extends Component {
  render() {
    return (
      <Modal
        width={400}
        visible={this.props.visible}
        title={`Comando ${this.props.command}`}
        cancelText="Fechar"
        onCancel={this.props.onCancel}
        footer={null}
      >
        <div className="div-main-ModalStatus">
          <table>
            <tr>
              <th style={{ width: "60%" }}>ip</th>
              <th style={{ width: "40%" }}>status</th>
            </tr>
            {this.props.content.map((item, idx) => (
              <tr key={idx}>
                <td>{item.ip}</td>
                {item.status ? (
                  <>
                    {item.status === "sucesso" ? (
                      <td className="block-td">
                        sucesso <CheckCircleTwoTone twoToneColor="#52c41a" />
                      </td>
                    ) : (
                      <td className="block-td">
                        erro <CloseCircleTwoTone twoToneColor="#f00400" />
                      </td>
                    )}
                  </>
                ) : (
                  <td className="block-td">
                    aguardando... <LoadingOutlined />
                  </td>
                )}
              </tr>
            ))}
          </table>
        </div>
      </Modal>
    );
  }
}

export default ModalCommand;
