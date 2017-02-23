/**
 *  Copyright (c) 2015-present, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import { format } from "d3-format";

import ValueList from "./ValueList";

/**
 * Renders a 'axis' that display a label for a data channel and a
 * max and average value:
 * ```
 *      +----------------+-----+------- ...
 *      | Traffic        | 120 |
 *      | Max 100 Gbps   |     | Chart  ...
 *      | Avg 26 Gbps    | 0   |
 *      +----------------+-----+------- ...
 * ```
 */
export default class LabelAxis extends React.Component {
  renderAxis() {
    const valueWidth = this.props.valWidth;
    const rectWidth = this.props.width - valueWidth;

    const style = {
      fontSize: 11,
      textAnchor: "left",
      fill: "#bdbdbd"
    };

    if (this.props.hideScale) {
      return <g />;
    }
    const valXPos = rectWidth + 3; // padding
    const fmt = this.props.format;
    const maxStr = format(fmt)(this.props.max);
    const minStr = format(fmt)(this.props.min);

    return (
      <g>
        <text x={valXPos} y={0} dy="1.2em" style={style}>
          {maxStr}
        </text>
        <text x={valXPos} y={this.props.height} style={style}>
          {minStr}
        </text>
      </g>
    );
  }

  render() {
    const valueWidth = this.props.valWidth;
    const rectWidth = this.props.width - valueWidth;

    const labelStyle = {
      fontSize: 12,
      textAnchor: "middle",
      fill: "#838383"
    };

    let valueList = null;
    let labelYPos;
    if (this.props.values) {
      labelYPos = Math.max(parseInt(this.props.height / 4, 10), 10);
      valueList = (
        <ValueList
          style={{ fill: "none", stroke: "none" }}
          values={this.props.values}
          width={rectWidth}
        />
      );
    } else {
      labelYPos = parseInt(this.props.height / 2, 10);
    }

    return (
      <g>
        <rect
          x="0"
          y="0"
          width={rectWidth}
          height={this.props.height}
          style={{ fill: "none", stroke: "none" }}
        />
        <text x={parseInt(rectWidth / 2, 10)} y={labelYPos} style={labelStyle}>
          {this.props.label}
        </text>
        <g transform={`translate(0,${labelYPos + 2})`}>
          {valueList}
        </g>

        {this.renderAxis()}
      </g>
    );
  }
}

LabelAxis.propTypes = {
  /**
   * The label to show as the axis.
   */
  label: React.PropTypes.string.isRequired,
  /**
   * Show or hide the max/min values that appear alongside the label
   */
  hideScale: React.PropTypes.bool,
  /**
   * Supply a list of label value pairs to render within the LabelAxis.
   * This expects an array of objects. Each object is of the form:
   *     {label: "Speed", value: "26.2 mph"}.
   */
  values: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string, // eslint-disable-line
      value: React.PropTypes.oneOfType([ // eslint-disable-line
        React.PropTypes.number,
        React.PropTypes.string
      ])
    })).isRequired,
  /**
   * Width to provide the values
   */
  valWidth: React.PropTypes.number,
  /**
   * Max value of the axis scale
   */
  max: React.PropTypes.number.isRequired,
  /**
   * Min value of the axis scale
   */
  min: React.PropTypes.number.isRequired,
  /**
   * If values are numbers, use this format string
   */
  format: React.PropTypes.string,
  /**
   * The width of the axis
   */
  width: React.PropTypes.number,
  /**
   * The height of the axis
   */
  height: React.PropTypes.number
};

LabelAxis.defaultProps = {
  hideScale: false,
  values: [],
  valWidth: 40,
  format: ".2f"
};
