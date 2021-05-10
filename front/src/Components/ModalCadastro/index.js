import React, { Component } from "react";
import "./index.css";
import { Modal, message } from "antd";
import { updateChip } from "../../service/chip";

class ModalCadastro extends Component {
  UpdateChip = async () => {
    const {
      id,
      razaoSocial,
      ip,
      cep,
      uf,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
    } = this.props.chip;

    const { status } = await updateChip({
      id,
      razaoSocial,
      ip,
      cep,
      uf,
      cidade,
      bairro,
      logradouro,
      numero,
      complemento,
    });

    if (status === 200) {
      message.success("Chip Atualizado");
      this.props.getAllChip();
      this.props.onCancel();
    }
  };
  render() {
    return (
      <Modal
        width={500}
        visible={this.props.visible}
        title="Editar Chip"
        cancelText="Fechar"
        okText="Finalizar"
        onCancel={this.props.onCancel}
        onOk={this.props.chip.id && this.UpdateChip}
        // onOk={this.props.chip.id ? this.UpdateChip : this.CreateChip}
      >
        <div className="div-main-modal">
          <div className="input-block">
            <input
              id="razaoSocial"
              name="razaoSocial"
              value={this.props.chip.razaoSocial}
              type="text"
              required
              onChange={this.props.onChange}
            />
            <label for="razaoSocial">Razão Social</label>
          </div>
          <div className="input-block">
            <input
              id="ip"
              name="ip"
              value={this.props.chip.ip}
              type="text"
              required
              onChange={this.props.onChange}
            />
            <label for="ip">IP</label>
          </div>
          <div className="div-block">
            <div className="input-block" style={{ width: "65%" }}>
              <input
                id="cep"
                name="cep"
                value={this.props.chip.cep}
                type="text"
                required
                onChange={this.props.onChange}
              />
              <label for="cep">CEP</label>
            </div>
            <div className="input-block" style={{ width: "30%" }}>
              <input
                id="uf"
                name="uf"
                value={this.props.chip.uf}
                type="text"
                required
                onChange={this.props.onChange}
              />
              <label for="uf">UF</label>
            </div>
          </div>
          <div className="input-block">
            <input
              id="bairro"
              name="bairro"
              value={this.props.chip.bairro}
              type="text"
              required
              onChange={this.props.onChange}
            />
            <label for="bairro">Bairro</label>
          </div>
          <div className="input-block">
            <input
              id="cidade"
              name="cidade"
              value={this.props.chip.cidade}
              type="text"
              required
              onChange={this.props.onChange}
            />
            <label for="cidade">Cidade</label>
          </div>
          <div className="div-block">
            <div className="input-block" style={{ width: "65%" }}>
              <input
                id="logradouro"
                name="logradouro"
                value={this.props.chip.logradouro}
                type="text"
                required
                onChange={this.props.onChange}
              />
              <label for="logradouro">Rua</label>
            </div>
            <div className="input-block" style={{ width: "30%" }}>
              <input
                id="numero"
                name="numero"
                value={this.props.chip.numero}
                type="text"
                required
                onChange={this.props.onChange}
              />
              <label for="numero">Número</label>
            </div>
          </div>
          <div className="input-block">
            <input
              id="complemento"
              name="complemento"
              value={this.props.chip.complemento}
              type="text"
              required
              onChange={this.props.onChange}
            />
            <label for="complemento">Complemento</label>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalCadastro;
