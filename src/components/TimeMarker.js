/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import { timeFormat } from "d3-time-format";
import moment from "moment";
import "moment-duration-format";

import ValueList from "./ValueList";
import Label from "./Label";

export default React.createClass({

    displayName: "TimeMarker",

    propTypes: {
        time: React.PropTypes.instanceOf(Date),

        /**
         * The values to show in the info box. This is either an array of
         * objects, with each object specifying the label and value
         * to be shown in the info box, or a simple string label
         */
        info: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    label: React.PropTypes.string,
                    value: React.PropTypes.string
                })
            )]),


        /**
         * The style of the info box and connecting lines
         */
        infoStyle: React.PropTypes.object,

        /**
         * The width of the hover info box
         */
        infoWidth: React.PropTypes.number,

        /**
         * The height of the hover info box
         */
        infoHeight: React.PropTypes.number,

        /**
         * Display the info box at all. If you don't have any values to show and just
         * want a line and a time (for example), you can set this to false.
         */
        showInfoBox: React.PropTypes.bool,

        /**
         * You can show the info box without the corresponding time marker. Why would
         * you do this? I don't know. Actually, I do. You might use the ChartContainer
         * tracker mechanism to show the line across multiple rows, then add a TimeMarker
         * selectively to each row.
         */
        showLine: React.PropTypes.bool,

        /**
         * You can hide the time displayed above the info box. You might do this because
         * it is already displayed elsewhere in your UI. Or maybe you just don't like it.
         */
        showTime: React.PropTypes.bool,

        /**
         * The time format (d3 time format) used for display of the time above the info box.
         */
        timeFormat: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            showInfoBox: true,
            showLine: true,
            showTime: true,
            infoStyle: {
                line: {
                    stroke: "#999",
                    cursor: "crosshair",
                    pointerEvents: "none"
                },
                box: {
                    fill: "white",
                    opacity: 0.90,
                    stroke: "#999",
                    pointerEvents: "none"
                },
                dot: {
                    fill: "#999"
                }
            },
            infoWidth: 90,
            infoHeight: 25
        };
    },

    renderLine(posx) {
        return (
            <line
                style={this.props.infoStyle.line}
                x1={posx}
                y1={0}
                x2={posx}
                y2={this.props.height} />
        );
    },

    renderTimeMarker(d) {
        const textStyle = {
            fontSize: 11,
            textAnchor: "left",
            fill: "#bdbdbd"
        };

        let dateStr = `${d}`;
        if (this.props.timeFormat === "day") {
            const formatter = timeFormat("%d");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "month") {
            const formatter = timeFormat("%B");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "year") {
            const formatter = timeFormat("%Y");
            dateStr = formatter(d);
        } else if (this.props.timeFormat === "relative") {
            dateStr = moment.duration(+d).format();
        } else {
            const formatter = timeFormat(this.props.timeFormat);
            dateStr = formatter(d);
        }

        return (
            <text
                x={0}
                y={0}
                dy="1.2em"
                style={textStyle}>
                {dateStr}
            </text>
        );
    },

    renderInfoBox(posx) {
        const w = this.props.infoWidth;

        const infoBoxProps = {
            align: "left",
            style: this.props.infoStyle.box,
            width: this.props.infoWidth,
            height: this.props.infoHeight
        };

        if (this.props.infoValues) {

            const infoBox = _.isString(this.props.infoValues) ? (
                    <Label {...infoBoxProps} label={this.props.infoValues} />
            ) : (
                    <ValueList {...infoBoxProps} values={this.props.infoValues} />
            );

            if (posx + 10 + w < this.props.width - 50) {
                return (
                    <g transform={`translate(${posx + 10},${5})`}>
                        {this.props.showTime ?
                            this.renderTimeMarker(this.props.time) : null}
                        <g transform={`translate(0,${this.props.showTime ? 20 : 0})`}>
                            {infoBox}
                        </g>
                    </g>
                );
            } else {
                return (
                    <g transform={`translate(${posx - w - 10},${5})`}>
                        {this.props.showTime ?
                            this.renderTimeMarker(this.props.time) : null}
                        <g transform={`translate(0,${this.props.showTime ? 20 : 0})`}>
                            {infoBox}
                        </g>
                    </g>
                );
            }
        } else {
            return (
                <g />
            );
        }
    },

    render() {
        const posx = this.props.timeScale(this.props.time);
        if (posx) {
            return (
                <g>
                    {this.props.showLine ? this.renderLine(posx) : null}
                    {this.props.showInfoBox ? this.renderInfoBox(posx) : null}
                </g>
            );
        }
        return null;
    }
});
