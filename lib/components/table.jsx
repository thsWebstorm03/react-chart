/*
 * ESnet React Charts, Copyright (c) 2014, The Regents of the University of
 * California, through Lawrence Berkeley National Laboratory (subject
 * to receipt of any required approvals from the U.S. Dept. of
 * Energy).  All rights reserved.
 *
 * If you have questions about your rights to use or distribute this
 * software, please contact Berkeley Lab's Technology Transfer
 * Department at TTD@lbl.gov.
 *
 * NOTICE.  This software is owned by the U.S. Department of Energy.
 * As such, the U.S. Government has been granted for itself and others
 * acting on its behalf a paid-up, nonexclusive, irrevocable,
 * worldwide license in the Software to reproduce, prepare derivative
 * works, and perform publicly and display publicly.  Beginning five
 * (5) years after the date permission to assert copyright is obtained
 * from the U.S. Department of Energy, and subject to any subsequent
 * five (5) year renewals, the U.S. Government is granted for itself
 * and others acting on its behalf a paid-up, nonexclusive,
 * irrevocable, worldwide license in the Software to reproduce,
 * prepare derivative works, distribute copies to the public, perform
 * publicly and display publicly, and to permit others to do so.
 *
 * This code is distributed under a BSD style license, see the LICENSE
 * file for complete information.
 */
 
import React from "react/addons";
import _ from "underscore";
import d3 from "d3";

import {TimeSeries, Event, IndexedEvent} from "pond";

export default React.createClass({

    displayName: "Table",

    propTypes: function() {
        return {
            series: React.PropTypes.instanceOf(TimeSeries).isRequired
        }
    },

    getDefaultProps: function() {
        return {
            timeFormat: undefined
        }
    },

    renderCells: function(event) {
        let cells = [];

        if (this.props.columns) {
            console.log("adding columns:")
            _.each(this.props.columns, (column) => {
                const formatter = column.format ? d3.format(column.format) : undefined;
                console.log("   - columns", column.key)
                if (column.key === "time") {
                    cells.push(
                        <td>
                            {event.index().toNiceString(this.props.timeFormat)}
                        </td>
                    );
                } else {
                    let value = event.data().get(column.key);
                    if (formatter) {
                        value = formatter(parseFloat(value, 10)); 
                        console.log(value)
                    }                    
                    cells.push (
                        <td>{value}</td>
                    );
                }               
            })
        } else {
            cells.push(
                <td>
                    {event.index().toNiceString(this.props.timeFormat)}
                </td>
            );

            event.data().forEach((d, i) => {
                cells.push (
                    <td>{d.toString()}</td>
                );
            });        
        }

        return cells;
    },

    renderRows: function() {
        let rows = [];
        for (let event of this.props.series.events()) {
            rows.push(
                <tr>{this.renderCells(event)}</tr>
            );
        }

        return rows;
    },

    renderHeader: function() {
        let headerCells = [];
        if (this.props.columns) {
            _.each(this.props.columns, (column) => {
                headerCells.push(
                    <th>{column.label}</th>
                );
            });
        } else {
            headerCells.push(
                <th>time</th>
            );
            this.props.series._columns.forEach((column) => {
                headerCells.push(
                    <th>{column}</th>
                );
            });
        }

        return headerCells;
    },

    render: function() {
        return (
            <table className="table table-condensed table-striped" width="300">
                    
                <tbody>
                    {this.renderHeader()}
                    {this.renderRows()}
                </tbody>
            </table>
        );
    }
});
