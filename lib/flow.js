'use babel';

import * as _ from "underscore";
import * as d3 from "d3";
import $ from "jquery";
import geoMath from "./geoMath.js";

export default {
  height: 600,
  width: "100%",
  render(selector, graph) {
    var self = this;
    this.boxes = [];
    this.listConnections = [];
    this.STOP = "stop";
    this.DRAG = "drag";
    this.CREATE_LINE = "createline";
    this.cleanSelection();
    this.screenState = this.STOP;
    this.svg = d3.select(selector).append("svg")
                                            .attr("width",this.width)
                                            .attr("height",this.height);
    this.svg.on("dblclick", function() {
        var x = d3.mouse(this)[0];
        var y = d3.mouse(this)[1];
        self.boxes.push( {id: self.boxes.length+1, box: self.createBox(x, y)} );
    });
    this.createGraph(graph);
  },
  removeSVG() {
    $("svg").remove();
  },
  createGraph(graph){
      var self = this;
      _.each(graph.flow, function(item){
        self.boxes.push( {id: item.id, box: self.createBox(item.x, item.y)} );
      });
      _.each(graph.links, function(link){
        var r1 = _.where(self.boxes, {id: link.in});
        var r2 = _.where(self.boxes, {id: link.out});
        if(r1.length > 0 && r2.length > 0){
            var sel1 = r1[0];
            var sel2 = r2[0];
            self.addConnection(sel1.box, sel2.box);
        }
      });
  },
  cleanSelection(){
      this.sel1 = undefined;
      this.sel2 = undefined;
  },
  setLine(box1, box2, line) {
      var t1 = geoMath.getTransform(box1.attr("transform")).translate;
      var t2 = geoMath.getTransform(box2.attr("transform")).translate;

      var p1 = {x: Number(t1[0])+65, y: Number(t1[1])+30};
      var p2 = {x: Number(t2[0])-10, y: Number(t2[1])+30};

      line
          .attr("x1", p1.x)
          .attr("y1", p1.y)
          .attr("x2", p2.x)
          .attr("y2", p2.y)
          .attr("class","line");
  },
  addConnection(box1, box2) {
      var lineGraph = this.svg.append("line")
                                          .attr("x1", 0)
                                          .attr("y1", 0)
                                          .attr("x2", 0)
                                          .attr("y2", 0);

      this.setLine(box1, box2, lineGraph);

      this.listConnections.push({box1: box1, box2: box2, line: lineGraph});
      this.cleanSelection();
  },
  connectBox(group) {
      if (this.sel1 == undefined) {
          this.sel1 = group;
      }else
      if(this.sel2 == undefined) {
          if(this.sel1.id != group.id){
              this.sel2 = group;
              this.addConnection(this.sel1, this.sel2);
          }
      }
  },
  updateLines(){
      var self = this;
    _.each(this.listConnections, function(item){
          self.setLine(item.box1, item.box2, item.line);
    });
  },
  createBox(x, y) {
      var self = this;
      var group = this.svg.append("g");
      group.id = new Date().valueOf();
      group.state = this.STOP;
      group.append("rect")
              .attr("rx", "5")
              .attr("ry", "5")
              .attr("class", "box");

      var boxTittle = group.append("rect")
              .attr("class", "boxTittle");

      group.append("text")
              .attr("class", "title")
              .attr("x", "0.5em")
              .attr("y", "1em")
              .text("Title");

      group.append("g")
              .attr("transform", "translate(10,20)")
              .append("path")
                      .attr("class", "icon")
                      .attr("d", "M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z")
                      .attr("transform","scale(0.07)");

      var elIn = group.append("rect")
              .attr("class", "in");

      var elOut = group.append("rect")
              .attr("class", "out");

      elIn.on("click", function(){
          self.connectBox(group);
      });
      elOut.on("click", function(){
          self.connectBox(group);
      });

      group.attr("transform", "translate(" + x + "," + y + ")");

      boxTittle.on("click", function() {
          if( group.state == self.DRAG){
              group.state = self.STOP;
              boxTittle.attr("class", "boxTittle border-top-rounded");
              group.attr("class", "box");
          }else{
              group.state = self.DRAG;
              boxTittle.attr("class", "boxTittleMove border-top-rounded");
              group.attr("class", "boxContainerMove");
          }
      });
      var dragHandler = d3.drag().on("drag", function () {
             if( group.state == self.DRAG){
                 var xDrag = d3.event.x;
                 var yDrag = d3.event.y;
                 group.attr("transform", "translate(" + xDrag + "," + yDrag + ")");
                 self.updateLines();
             }
      });
      dragHandler(group);
      return group;
  }
};
