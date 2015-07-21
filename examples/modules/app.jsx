"use strict";

var React = require("react/addons");
var Router = require("react-router");
var {RouteHandler,
     Link} = Router;

require("../styles/app.css");
var logo = document.createElement('img');
logo.src = require('../img/logo.png');

export default React.createClass({

  render: function() {
    
    var sidebarStyle = {
        borderRightStyle: "solid",
        borderRightColor: "#F2F1F1",
        borderRightWidth: 1
    }

    return (
      <div>
          <div className="row">
              <div className="col-md-2">
                  <img style={{float: "right"}} className="main-image" src={logo.src} width={80}/>
              </div>
              <div className="col-md-10">
                  <h2>ESnet React Charts Library</h2>
              </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-md-2" style={sidebarStyle}>
              <div className="docs-sidebar">
                  <ul className="docs-sidenav nav">
                    <li><Link to="intro">Introduction</Link></li>

                    <hr />

                    Basics:
                    <li><Link to="linecharts">Line charts</Link></li>
                    <li><Link to="areacharts">Area charts</Link></li>
                    <li><Link to="barcharts">Bar charts</Link></li>
                    
                    <hr />

                    Examples:
                    <li><Link to="history">ESnet history example</Link></li>
                    <li><Link to="weather">Weather example</Link></li>
                    <li><Link to="ddos">DDoS example</Link></li>

                    <hr />

                    Extras:
                    <li><Link to="legends">Legends</Link></li>
                    <li><Link to="table">Tables</Link></li>

                  </ul>
              </div>
            </div>

            <div className="col-md-10">
              <RouteHandler />
            </div>

          </div>
      </div>
    );
  }
});
