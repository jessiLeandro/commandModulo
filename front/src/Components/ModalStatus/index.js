import React, { Component } from "react";
import "./index.css";
import { Modal } from "antd";
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined,
  WarningTwoTone,
  DownOutlined,
} from "@ant-design/icons";
import moment from "moment";

const formatTempoMs = (tempo_ms) => {
  const dias = Math.trunc(tempo_ms / 86400000);
  const horas = Math.trunc((tempo_ms % 86400000) / 3600000);
  const minutos = Math.trunc((tempo_ms % 3600000) / 60000);
  const segundos = Math.trunc((tempo_ms % 60000) / 1000);

  return `${dias} dias, ${horas} horas, ${minutos} min, ${segundos} s`;
};

const formatTempoInternoMs = (tempo_ms) => {
  const minutos = Math.trunc((tempo_ms % 3600000) / 60000);
  const segundos = Math.trunc((tempo_ms % 60000) / 1000);

  return `${minutos} min, ${segundos} s`;
};

class ModalStatus extends Component {
  state = {
    index: -1,
  };
  render() {
    return (
      <Modal
        width={700}
        visible={this.props.visible}
        title="Status"
        onCancel={() => {
          this.setState({ index: -1 });
          this.props.onCancel();
        }}
        footer={null}
      >
        <div className="div-main-ModalStatus">
          {this.props.content.map((item, index) => (
            <div
              className="div-card-status"
              up={index === this.state.index ? "true" : "false"}
            >
              <div className="div-block">
                <label>
                  <strong>Modulo: </strong>
                  {item.numeroModulo}

                  <strong style={{ marginLeft: "20px" }}>
                    {item.sonoffDoisRele ? "(2 Reles)" : "(1 Rele)"}
                  </strong>
                </label>
                <label>
                  <strong>IP: </strong>
                  {item.ip}
                </label>
              </div>
              <div className="div-block">
                <label>{item.razaoSocial}</label>

                {item.status ? (
                  <>
                    {item.status === "erro" ? (
                      <p>
                        {`${moment(item.updatedAt).calendar()},  Offline  `}
                        <WarningTwoTone
                          twoToneColor="#FFE51E"
                          className="icon-status-conexao"
                        />
                      </p>
                    ) : (
                      <label className="label-status-conexao">
                        Online
                        <CheckCircleTwoTone
                          className="icon-status-conexao"
                          twoToneColor="#52c41a"
                        />
                      </label>
                    )}
                  </>
                ) : (
                  <label>
                    {"Aguardando...    "}
                    <LoadingOutlined className="icon-status-conexao" />
                  </label>
                )}
              </div>
              <div className="div-block">
                <p>
                  {item.logradouro} {item.numero}, {item.bairro}, {item.cep}{" "}
                  {item.cidade}, {item.uf}
                </p>
                {item.status && (
                  <DownOutlined
                    onClick={() =>
                      this.setState({
                        index: this.state.index === index ? -1 : index,
                      })
                    }
                    id="icon-UpOutlined-modalStatus"
                    up={index === this.state.index ? "true" : "false"}
                  />
                )}
              </div>
              <div
                className="div-content-upDown"
                up={index === this.state.index ? "true" : "false"}
              >
                <div className="div-block">
                  <label>
                    <strong>Tempo p/ verificar conexão: </strong>
                    {formatTempoInternoMs(item.tempoParaTestar)}
                  </label>
                </div>
                <div className="div-block">
                  <label>
                    <strong>Tempo verificando conexão: </strong>
                    {formatTempoInternoMs(item.tempoDeTeste)}
                  </label>
                </div>
                <div className="div-block">
                  <label>
                    <strong>Tempo ligado: </strong>
                    {formatTempoMs(item.tempoLigado_ms)}
                  </label>
                  <label>
                    <strong>Tempo desligado: </strong>
                    {formatTempoMs(item.tempoDesligado_ms)}
                  </label>
                </div>
                <div className="div-block">
                  <label>
                    <strong>Tempo sem conexão: </strong>
                    {formatTempoMs(item.tempoSemConexao_ms)}
                  </label>

                  <label>
                    <strong>Maior Tempo sem conexão: </strong>
                    {formatTempoMs(item.maiorTempoSemConexao)}
                  </label>
                </div>
                <div className="div-block">
                  <label>
                    <strong>Vezes que o sonoff ligou: </strong>
                    {item.contadorSonoffLigado}
                  </label>
                  <label>
                    <strong>Vezes que modulo resetou: </strong>
                    {item.contadorModuloResetado}
                  </label>
                </div>
                <div className="div-block">
                  <label>
                    {item.sonoffDoisRele ? (
                      <>
                        <strong>Relogio Ligado: </strong>
                        {item.equipamentoLigado ? (
                          <CheckCircleTwoTone twoToneColor="#52c41a" />
                        ) : (
                          <CloseCircleTwoTone twoToneColor="#f00400" />
                        )}
                      </>
                    ) : null}
                  </label>
                  <label>
                    <strong>Modulo Ligado: </strong>
                    {item.moduloLigado ? (
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    ) : (
                      <CloseCircleTwoTone twoToneColor="#f00400" />
                    )}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    );
  }
}

export default ModalStatus;
