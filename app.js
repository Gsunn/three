// inspired by
// https://bl.ocks.org/pjsier/fbf9317b31f070fd540c5523fef167ac
var D3_CHART = {

    selector: '#d3_chart',

    dataSource:[],
    data:[],
    svg: null,
    mainGroup: null,
    scaleX: null,

    options:{
        width: 640,
        height: 480,
        margins: {
            top: 20,
            right: 40,
            bottom: 20,
            left: 40,
        },
        MAX_LENGTH:100,
        duration:2000,
        color: d3.schemeAccent
    },

    init: function(){
        var el = d3.select(this.selector);
        if(el.empty()){
            console.warn('init(): Element for "'+this.selector+'" selector not found');
            return;
        }

        console.log('d3 version: ', d3.version);
        
   

        this.seedData();

        this.draw();

        //window.setInterval(this.updateData, D3_CHART.options.duration);
        
        websocket();
    },

    updateData: function(data){
        var now = new Date();
        /*var lineData = {
            time: now,
            x: D3_CHART.randomNumberBounds(0, 5),
            y: D3_CHART.randomNumberBounds(0, 2.5),
            z: D3_CHART.randomNumberBounds(0, 10)
        };*/
        
        var lineData = {
             time: now,
             temp: "",
             hum: "",
             //z: D3_CHART.randomNumberBounds(0, 10)
         };
        
        if(data[0].value != "--"){
                //console.log(data[0].value);
                //console.log(data[1]);
            lineData.temp = data[0].value;
            lineData.hum = data[1].value;
            
        }


        D3_CHART.dataSource.push(lineData);
        if (D3_CHART.dataSource.length > 30) {
            D3_CHART.dataSource.shift();
        }
        D3_CHART.draw();
    },

    draw: function(){
        var self = this;

        // Based on https://bl.ocks.org/mbostock/3884955
        /*self.data = ["x", "y", "z"].map(function(c) {
            return {
                label: c,
                values: self.dataSource.map(function(d) {
                    return {
                        time: +d.time,
                        value: d[c]
                    };
                })
            };
        });*/
        
        
        self.data = ["temp", "hum"].map(function(c) {
            return {
                label: c,
                values: self.dataSource.map(function(d) {
                    return {
                        time: +d.time,
                        value: d[c]
                    };
                })
            };
        });

        var transition = d3.transition().duration(this.options.duration).ease(d3.easeLinear),
            xScale = d3.scaleTime().rangeRound([0, this.options.width-this.options.margins.left-this.options.margins.right]),
            yScale = d3.scaleLinear().rangeRound([this.options.height-this.options.margins.top-this.options.margins.bottom, 0]),
            zScale = d3.scaleOrdinal(this.options.color);

        var xMin = d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
        var xMax = new Date(new Date(d3.max(self.data, function(c) {
            return d3.max(c.values, function(d) { return d.time; })
        })).getTime() - 2*this.options.duration);
        //})).getTime());

        xScale.domain([xMin, xMax]);

        /*yScale.domain([
            d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.value; })}),
            d3.max(self.data, function(c) { return d3.max(c.values, function(d) { return d.value; })})
        ]);*/
        
        yScale.domain([
            d3.min(self.data, function(c) { return d3.min(c.values, function(d) { return d.value - 10; })} ),
            d3.max(self.data, function(c) { return d3.max(c.values, function(d) { return d.value + 10; })} )
        ]);
        
        zScale.domain(self.data.map(function(c) { return c.label; }));

        var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d.time); })
            .y(function(d) { return yScale(d.value); });

        var svg = d3.select(this.selector).selectAll("svg").data([this.data]);
        var gEnter = svg.enter().append("svg")
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .append("g")
            .attr('transform', 'translate(' + this.options.margins.left + ',' + this.options.margins.top + ')');
        gEnter.append("g").attr("class", "axis x");
        gEnter.append("g").attr("class", "axis y");

        gEnter.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
            .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

        gEnter.append("g")
            .attr("class", "lines")
            .attr("clip-path", "url(#clip)")
            .selectAll(".data")
            .data(this.data)
            .enter()
            .append("path")
            .attr("class", "data");

        var legendEnter = gEnter.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (this.options.width-this.options.margins.right-this.options.margins.left-105) + ",5)");
        legendEnter.append("rect")
            .attr("width", 100)
            .attr("height", 60)
            .attr("fill", "#ffffff")
            .attr("fill-opacity", 0.2);
        legendEnter.selectAll("text")
            .data(this.data)
            .enter()
            .append("text")
            .attr("y", function(d, i) { return (i*20) + 25; })
            .attr("x", 5)
            .attr("fill", function(d) { return zScale(d.label); });

        var g = svg.select("g");

        //Dibuja los ejes y el grid tickSize
       g.select("g.axis.x")
            .attr("transform", "translate(0," + (this.options.height-this.options.margins.bottom-this.options.margins.top) + ")")
            .transition(transition)
            .call(d3.axisBottom(xScale)
                  .ticks(5).tickSize( this.options.margins.bottom + this.options.margins.top - this.options.height))
            .style("stroke-dotarray", ("3,3"));

        g.select("g.axis.y")
            .transition(transition)
            .attr("class", "axis y")
            .call(d3.axisLeft(yScale).tickSize( this.options.margins.right + this.options.margins.left - this.options.width ));

        
        
        g.select("defs clipPath rect")
            .transition(transition)
            .attr("width", this.options.width-this.options.margins.left-this.options.margins.right)
            .attr("height", this.options.height-this.options.margins.top-this.options.margins.bottom);

        g.selectAll("g path.data")
            .data(this.data)
            .style("stroke", function(d) { return zScale(d.label); })
            .style("stroke-width", 1)
            .style("fill", "none")
            .transition()
            .duration(this.options.duration)
            .ease(d3.easeLinear)
            .on("start", tick);

        g.selectAll("g .legend text")
            .data(this.data)
            .text(function(d) {
                return d.label.toUpperCase() + ": " + d.values[d.values.length-1].value;
            });
        
        
        

        // For transitions https://bl.ocks.org/mbostock/1642874
        function tick() {
            // Redraw the line.
            d3.select(this)
                .attr("d", function(d) { return line(d.values); })
                .attr("transform", null);

            // Slide it to the left.
            var xMinLess = new Date(new Date(xMin).getTime() - D3_CHART.options.duration);
            d3.active(this)
                .attr("transform", "translate(" + xScale(xMinLess) + ",0)")
                .transition();
        }
    },



    clearChart: function(){
        var el = d3.select(this.selector);
        if(el.empty()){
            console.warn('clearChart(): Element for "'+this.selector+'" selector not found');
            return;
        }

        // clear element
        el.html("");
    },

    seedData: function() {
        var now = new Date();
        for (var i = 0; i < this.options.MAX_LENGTH; ++i) {
            this.dataSource.push({
                time: new Date(now.getTime() - ((this.options.MAX_LENGTH - i) * this.options.duration)),
                temp: 0,
                hum: 0,
                //z: 0
            });
        }
    },

    randomNumberBounds: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    }
};

function getData(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        return this.responseText;
      }
    };
    xhttp.open("GET", "/humidity", true);
    xhttp.send();
}


function websocket(){
    //let socket = new WebSocket("wss://192.168.1.144:81");
    let socket = new WebSocket("ws://192.168.1.144:80/ws");


    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        socket.send("My name is JVV");
    };

    socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        let msg = event.data;
        try {
                var obj = JSON.parse(event.data);
                D3_CHART.updateData(obj);
                d3.select("#chart").datum([obj[0].value]).call(gauge);
                d3.select("#chartHum").datum([obj[1].value]).call(gaugeHum);
          } catch (e) {
                // error
                console.log("er parse json");
                return;
          }
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
}
