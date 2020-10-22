import React, { Component } from "react";
import { DragSource, DragPreviewImage } from "react-dnd";
import {
  EditOutlined,
  ArrowRightOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import "./index.css";

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

const itemSource = {
  canDrag: (props) => !props.forbidDrag,

  beginDrag(props) {
    return props.item;
  },

  // endDrag(props, monitor, component) {
  //   if (!monitor.didDrop()) {
  //     return;
  //   }

  //   return props.handleDrop(props.item.id);
  // },
};

class Item extends Component {
  constructor(pros) {
    super(pros);

    this.state = {
      isMobile: false,
    };
  }

  render() {
    const {
      isDragging,
      connectDragSource,
      item,
      connectDragPreview,
    } = this.props;
    const backgroundColor = item.error
      ? "#f8cacc"
      : `${item.ip === null ? "#faf4d0" : "lightblue"}`;

    const opacity = isDragging ? 0.5 : 1;

    return (
      <>
        <div
          ref={connectDragSource}
          className="item"
          style={{ opacity, backgroundColor }}
          onDoubleClick={this.props.onDoubleClick}
        >
          <h3>
            N°:{" "}
            <strong style={{ marginRight: "15px" }}>{item.numeroModulo}</strong>{" "}
            IP: <strong>{item.ip}</strong>
          </h3>
          <div>
            {this.props.editView ? (
              <EditOutlined onClick={this.props.onEdit} />
            ) : null}
            {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            ) ? (
              <>
                {this.props.editView ? (
                  <ArrowRightOutlined
                    style={{ marginLeft: "10px" }}
                    onClick={this.props.onDoubleClick}
                  />
                ) : (
                  <RollbackOutlined
                    style={{ marginLeft: "10px" }}
                    onClick={this.props.onDoubleClick}
                  />
                )}
              </>
            ) : null}
          </div>
        </div>
        <DragPreviewImage connect={connectDragPreview} src={"./nuvem1.png"} />
      </>
    );
  }
}

export default DragSource("item", itemSource, collect)(Item);
