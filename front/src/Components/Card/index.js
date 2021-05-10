import React, { Component } from "react";
import { DropTarget } from "react-dnd";
import { Spin } from "antd";
import "./index.css";
import Item from "../Item";

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    item: monitor.getItem(),
    hovered: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingColor: monitor.getItemType(),
  };
}

const itemSource = {
  drop(props, monitor) {
    return props.onDrop(monitor.getItem());
  },

  // canDrop(props, monitor) {
  //   return props.onDrop(monitor.getItem());
  // },
};

class Card extends Component {
  render() {
    const { connectDropTarget, hovered } = this.props;
    const backgroundColor = hovered ? "rgba(173, 216, 230, 0.1)" : "white";
    const opacity = hovered ? 1 : 0.8;

    return connectDropTarget(
      <div style={{ width: "100%", height: "100%" }}>
        {this.props.spin ? (
          <Spin tip="Loading...">
            <div
              className="target"
              style={{ background: backgroundColor, opacity: opacity }}
            >
              {this.props.items.map((chip) => (
                <Item
                  editView={!!this.props.onEdit}
                  item={chip}
                  key={chip.id}
                  color={"blue"}
                  onDoubleClick={() => {
                    this.props.onDoubleClick(chip.id);
                  }}
                  onEdit={() => this.props.onEdit(chip)}
                />
              ))}
            </div>
          </Spin>
        ) : (
          <div
            className="target"
            style={{ background: backgroundColor, opacity: opacity }}
          >
            {this.props.items.map((chip) => (
              <Item
                editView={!!this.props.onEdit}
                item={chip}
                key={chip.id}
                color={"blue"}
                onDoubleClick={() => {
                  this.props.onDoubleClick(chip.id);
                }}
                onEdit={() => this.props.onEdit(chip)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default DropTarget("item", itemSource, collect)(Card);
