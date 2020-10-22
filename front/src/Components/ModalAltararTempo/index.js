import React, { Component } from "react";
import { Modal, Slider } from "antd";
import "./index.css";
import { getCommand } from "../../service/sonoff1";

import {
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";

class ModalAltararTempo extends Component {
  constructor(pros) {
    super(pros);

    this.state = { chips: [] };
  }

  GetCommand = async (value) => {
    this.props.onOk();
    await Promise.all(
      this.props.chips.map(async (chipSelec) => {
        try {
          const response = await getCommand(
            chipSelec.ip,
            this.props.command,
            chipSelec[this.props.command]
          );
          if (response.status === 200) {
            this.props.onOk(chipSelec, "sucesso");
            this.props.handleDropCadastro(chipSelec.id);
          } else if (response.status === 408) {
            this.props.onOk(chipSelec, "erro");
          }
        } catch (erro) {
          this.props.onOk(chipSelec, "erro");
          console.error(erro);
        }
      })
    );
  };

  render() {
    return (
      <Modal
        width={500}
        visible={this.props.visible}
        title={this.props.title}
        cancelText="Cancelar"
        okText="Confirmar"
        onCancel={this.props.onCancel}
        onOk={this.GetCommand}
      >
        <div className="div-block-slider">
          <label>
            <strong>Mover todos</strong>
          </label>
          <Slider
            defaultValue={300000}
            onChange={(value) =>
              this.props.chips.map((chip) => {
                this.props.onChange(chip, value);
                // eslint-disable-next-line array-callback-return
                return;
              })
            }
            min={300000}
            max={1800000}
            tipFormatter={(value) => {
              const min = Math.trunc(value / 60000);
              const seg = Math.trunc((value % 60000) / 1000);
              return `${min}:${(seg / 100).toFixed(2).split(".")[1]}`;
            }}
          />
        </div>
        <br />
        {this.props.chips.map((chip) => (
          <div key={chip.id} className="div-block-slider">
            <div className="div-block">
              <label>
                <strong>IP: </strong>
                {chip.ip}
              </label>
              <label>
                {!chip.status && chip.loading && (
                  <>
                    {"Aguardando...  "}
                    <LoadingOutlined />
                  </>
                )}

                {chip.status === "erro" && (
                  <>
                    {"erro  "}
                    <CloseCircleTwoTone twoToneColor="#f00400" />
                  </>
                )}

                {chip.status === "sucesso" && (
                  <>
                    {"sucesso  "}
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  </>
                )}
              </label>
            </div>
            <Slider
              value={chip[this.props.command]}
              onChange={(value) => this.props.onChange(chip, value)}
              min={300000}
              max={1800000}
              tipFormatter={(value) => {
                const min = Math.trunc(value / 60000);
                const seg = Math.trunc((value % 60000) / 1000);
                return `${min}:${(seg / 100).toFixed(2).split(".")[1]}`;
              }}
            />
          </div>
        ))}
      </Modal>
    );
  }
}

export default ModalAltararTempo;
