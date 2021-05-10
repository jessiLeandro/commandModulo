import React, { Component } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import * as R from "ramda";
import "./index.css";

import { mascara } from "./validate";
import { getAddressByZipCode } from "../../service/viacep";
import { GetAllChip } from "../../service/chip";
import { getStatus, getCommand } from "../../service/sonoff1";

import ModalCadastro from "../../Components/ModalCadastro/index";
import ModalAltararTempo from "../../Components/ModalAltararTempo";
import ModalStatus from "../../Components/ModalStatus";
import ModalCommand from "../../Components/ModalCommand";

import Card from "../../Components/Card";

class MainPage extends Component {
  state = {
    titleModalAlterarTempo: "",
    visibleModalCadastro: false,
    visibleModalAlterarTempo: false,
    visibleModalStatus: false,
    visibleModalCommand: false,

    command: "",

    statusArray: [],

    commandArray: [],

    chip: {
      id: undefined,
      razaoSocial: "",
      ip: "",
      cep: "",
      uf: "",
      cidade: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: "",
    },

    chipsSelec: [],
    chips: [],
    total: 10,
    count: 0,
    page: 1,

    search: false,
    searchValue: "",

    spin: false,
  };

  onChange = async (e) => {
    const { name, valor } = mascara(
      e.target.name,
      e.target.value,
      this.state.chip[e.target.name]
    );

    this.setState((prevState) => {
      return {
        chip: { ...prevState.chip, [name]: valor },
      };
    });

    if (name === "cep") {
      const { status, data } = await getAddressByZipCode(valor);

      if (status === 200) {
        if (R.has("erro", data)) {
          // this.setState({
          //   fieldErrors: { ...fieldErrors, [name]: true },
          // });
        } else {
          const { logradouro, bairro, localidade: cidade, uf } = data;
          await this.setState((prevState) => {
            return {
              chip: {
                ...prevState.chip,
                logradouro,
                bairro,
                cidade,
                uf,
              },
            };
          });
        }
      }
    }
  };

  onChangeSearch = async (e) => {
    const { value: searchValue } = e.target;

    await this.setState({ searchValue });

    await this.getAllChip();
  };

  getAllChip = async (e) => {
    const query = {
      filters: {
        chip: {
          global: {
            fields: ["razaoSocial", "ip", "numeroModulo"],
            value: this.state.search ? this.state.searchValue : "",
          },
        },
      },
      chipsExclude: this.state.chipsSelec.map((chip) => chip.id),
    };

    const { status, data } = await GetAllChip(query);

    if (status === 200) {
      this.setState({
        chips: data.rows,
        page: data.page,
        count: data.count,
        show: data.show,
      });
    }
  };

  componentDidMount = async () => {
    await this.getAllChip();
  };

  handleDropCadastro = (id) => {
    this.setState((prevState) => {
      return {
        chipsSelec: prevState.chipsSelec.filter((item) => item.id !== id),
        chips: [
          ...prevState.chips,
          ...prevState.chipsSelec
            .filter((item) => item.id === id)
            .map((item) => {
              return { ...item, error: undefined };
            }),
        ],
      };
    });
  };

  handleDropSelecionado = (id) => {
    this.setState((prevState) => {
      const chipsSelec = prevState.chips.filter((item) => item.id === id);
      if (chipsSelec.length !== 0 && !chipsSelec[0].ip) {
        return;
      }
      return {
        chips: prevState.chips.filter((item) => item.id !== id),
        chipsSelec: [
          ...prevState.chipsSelec,
          ...prevState.chips.filter((item) => item.id === id),
        ],
      };
    });
  };

  GetStatus = async () => {
    await this.setState((prevState) => {
      return {
        spin: true,
        visibleModalStatus: true,
        statusArray: prevState.chipsSelec,
      };
    });
    await Promise.all(
      await this.state.chipsSelec.map(async (chipSelec) => {
        try {
          const { status, data } = await getStatus(chipSelec.ip);

          if (status === 200) {
            await this.setState((prevState) => {
              return {
                statusArray: [
                  ...prevState.statusArray.filter(
                    (item) => item.id !== chipSelec.id
                  ),
                  { ...chipSelec, ...data, status: "sucesso" },
                ],
                visibleModalStatus: true,
              };
            });

            this.handleDropCadastro(chipSelec.id);

            return data;
          } else if (status === 408) {
            this.setState((prevState) => {
              return {
                chipsSelec: [
                  ...prevState.chipsSelec.filter(
                    (chip) => chip.id !== chipSelec.id
                  ),
                  { ...chipSelec, error: true },
                ],
                statusArray: [
                  ...prevState.statusArray.filter(
                    (item) => item.id !== chipSelec.id
                  ),
                  { ...chipSelec, status: "erro", ...data },
                ],
              };
            });
          }
        } catch (erro) {
          this.setState((prevState) => {
            return {
              statusArray: [
                ...prevState.statusArray.filter(
                  (item) => item.id !== chipSelec.id
                ),
                { ...chipSelec, status: "erro" },
              ],
            };
          });
          console.error(erro);
        }
      })
    );
    await this.setState({ spin: false });
  };

  GetCommand = async (command) => {
    await this.setState((prevState) => {
      return {
        spin: true,
        visibleModalCommand: true,
        commandArray: prevState.chipsSelec,
        command,
      };
    });
    await Promise.all(
      this.state.chipsSelec.map(async (chipSelec) => {
        try {
          const response = await getCommand(chipSelec.ip, command, 1);
          if (response.status === 200) {
            this.setState((prevState) => {
              return {
                commandArray: [
                  ...prevState.commandArray.filter(
                    (item) => item.id !== chipSelec.id
                  ),
                  { ...chipSelec, status: "sucesso" },
                ],
              };
            });
            this.handleDropCadastro(chipSelec.id);
          } else if (response.status === 408) {
            this.setState((prevState) => {
              return {
                chipsSelec: [
                  ...prevState.chipsSelec.filter(
                    (chip) => chip.id !== chipSelec.id
                  ),
                  { ...chipSelec, error: true },
                ],
                commandArray: [
                  ...prevState.statusArray.filter(
                    (item) => item.id !== chipSelec.id
                  ),
                  { ...chipSelec, status: "erro" },
                ],
              };
            });
          }
        } catch (erro) {
          this.setState((prevState) => {
            return {
              chipsSelec: [
                ...prevState.chipsSelec.filter(
                  (chip) => chip.id !== chipSelec.id
                ),
                { ...chipSelec, error: true },
              ],
              commandArray: [
                ...prevState.commandArray.filter(
                  (item) => item.id !== chipSelec.id
                ),
                { ...chipSelec, status: "erro" },
              ],
            };
          });
          console.error(erro);
        }
      })
    );

    this.setState({ spin: false });
  };

  onCancelModalCadastro = () => {
    this.setState({
      visibleModalCadastro: false,
      chip: {
        id: undefined,
        razaoSocial: "",
        ip: "",
        cep: "",
        uf: "",
        cidade: "",
        bairro: "",
        logradouro: "",
        numero: "",
        complemento: "",
      },
    });
  };

  render() {
    return (
      <div className="div-main">
        <ModalCadastro
          visible={this.state.visibleModalCadastro}
          onCancel={this.onCancelModalCadastro}
          getAllChip={this.getAllChip}
          chip={this.state.chip}
          onChange={this.onChange}
        />
        <ModalAltararTempo
          command={this.state.command}
          title={this.state.titleModalAlterarTempo}
          chips={this.state.commandArray}
          visible={this.state.visibleModalAlterarTempo}
          onCancel={async () => {
            await this.setState({
              spin: false,
              visibleModalAlterarTempo: false,
              titleModalAlterarTempo: "",
              command: "",
            });
            await this.getAllChip();
          }}
          onOk={(chipSelec, status) => {
            this.setState((prevState) => {
              let commandArray = prevState.commandArray;

              commandArray = prevState.commandArray.map((chip) => {
                return { ...chip, loading: true };
              });

              return {
                spin: true,
                commandArray: status
                  ? [
                      ...commandArray.filter(
                        (item) => item.id !== chipSelec.id
                      ),
                      { ...chipSelec, status },
                    ]
                  : commandArray,
              };
            });
          }}
          onChange={(chip, value) =>
            this.setState((prevState) => {
              const { chipsSelec } = prevState;

              const index = R.findIndex(R.propEq("id", chip.id))(chipsSelec);

              chipsSelec[index][this.state.command] = value;

              return {
                chipsSelec,
              };
            })
          }
          handleDropCadastro={this.handleDropCadastro}
        />
        <ModalStatus
          visible={this.state.visibleModalStatus}
          onCancel={async () => {
            await this.setState({ visibleModalStatus: false, statusArray: [] });
            await this.getAllChip();
          }}
          content={this.state.statusArray}
        />
        <ModalCommand
          command={this.state.command}
          visible={this.state.visibleModalCommand}
          onCancel={async () => {
            await this.setState({ visibleModalCommand: false, command: "" });
            await this.getAllChip();
          }}
          content={this.state.commandArray}
        />
        <Row justify="space-between" gutter={[20, 15]} className="row-main">
          <Col span={24} md={12} lg={8}>
            <div className="div-card">
              <div className="div-block">
                <div className="div-block-cadastro">
                  <h1>Modulos</h1>
                  {/* <button
                className="button-logar"
                onClick={() => this.setState({ visibleModalCadastro: true })}
              >
                <PlusOutlined style={{ fontSize: "10px" }} />
              </button> */}
                </div>

                <button
                  className="button-logar"
                  style={{ borderRadius: "10px" }}
                  onClick={() => this.setState({ search: !this.state.search })}
                >
                  <SearchOutlined />
                </button>
              </div>
              {this.state.search ? (
                <div className="div-block-search">
                  <div className="input-search">
                    <input
                      placeholder="Buscar..."
                      value={this.state.searchValue}
                      onChange={this.onChangeSearch}
                      style={{ marginBottom: "10px" }}
                    />
                  </div>
                </div>
              ) : null}
              <div
                style={{
                  height: this.state.search ? "calc(90% - 47px)" : "90%",
                }}
              >
                <Card
                  spin={this.state.spin}
                  items={this.state.chips}
                  onDrop={(item) => this.handleDropCadastro(item.id)}
                  onDoubleClick={this.handleDropSelecionado}
                  onEdit={(chip) =>
                    this.setState({ chip, visibleModalCadastro: true })
                  }
                />
              </div>
            </div>
          </Col>
          <Col span={24} md={12} lg={8}>
            <div className="div-card">
              <div className="div-block">
                <h1>Selecionados</h1>
              </div>
              <div style={{ height: "90%" }}>
                <Card
                  spin={this.state.spin}
                  items={this.state.chipsSelec}
                  onDrop={(itemSelecionado) =>
                    this.handleDropSelecionado(itemSelecionado.id)
                  }
                  onDoubleClick={this.handleDropCadastro}
                />
              </div>
            </div>
          </Col>
          <Col span={24} lg={8}>
            <div className="div-card">
              <h1>Ação</h1>
              <Row gutter={[20, 0]}>
                {[
                  {
                    label: "Alterar tempo para verificar conexão",
                    onClick: () =>
                      this.setState((prevState) => {
                        return {
                          visibleModalAlterarTempo: true,
                          titleModalAlterarTempo:
                            "Alterar tempo para veriricar conexao",
                          command: "tempoParaTestar",
                          commandArray: prevState.chipsSelec,
                        };
                      }),
                  },
                  {
                    label: "Alterar tempo em que espera conexão",
                    onClick: () =>
                      this.setState((prevState) => {
                        return {
                          visibleModalAlterarTempo: true,
                          titleModalAlterarTempo:
                            "Alterar Tempo de verificação",
                          command: "tempoDeTeste",
                          commandArray: prevState.chipsSelec,
                        };
                      }),
                  },
                  {
                    label: "Ligar Equipamento",
                    onClick: () => this.GetCommand("ligarRelogio"),
                  },
                  {
                    label: "Desligar Equipamento",
                    onClick: () => this.GetCommand("desligarRelogio"),
                  },
                  {
                    label: "Resetar Equipamento",
                    onClick: () => this.GetCommand("resetRelogio"),
                  },
                  {
                    label: "Resetar módulo",
                    onClick: () => this.GetCommand("resetModulo"),
                  },

                  { label: "Status", onClick: this.GetStatus },
                ].map((item) => (
                  <Col span={24} md={12} lg={24} key={item.label}>
                    <button
                      className="button-logar"
                      style={{ width: "100%", height: "60px" }}
                      onClick={item.onClick}
                      disabled={
                        this.state.chipsSelec.length === 0 ||
                        this.state.spin ||
                        (item.label.indexOf("Equipamento") !== -1 &&
                          !!R.find(R.propEq("sonoffDoisRele", false))(
                            this.state.chipsSelec
                          ))
                      }
                    >
                      <label>{item.label}</label>
                    </button>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MainPage;
