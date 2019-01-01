/**************************** original - inicio **************************************************/
Rickshaw.Graph.Socketio = Rickshaw.Class.create( Rickshaw.Graph.Ajax, {
	request: function() {
		var socket = io.connect(this.dataURL);
		var self = this;
		socket.on('rickshaw', function (data) {
			self.success(data);
		});
	}
});
/**************************** original - fin *****************************************************/

/**************************** para uso - inicio **************************************************/
Rickshaw.Graph.Socketio.Static = Rickshaw.Class.create(Rickshaw.Graph.Socketio, {
	request: function () {
		var socket = io.connect('http://localhost:3000');
		thisData = this;
		socket.on('rickshaw', function (data) {
			thisData.success(data.mensaje);
		});
	}
});
/**************************** para uso - fin *****************************************************/

var legend = new Rickshaw.Graph.Legend( {
	graph: graph,
	element: document.getElementById('legend')
} );

var legend = Rickshaw.Class.create(Rickshaw.Graph.Legend{})

var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart"),
	width: 900,	//screen.width*0.5
	height: 500,
	renderer: 'line',
	stroke: true,
	preserve: true,
	series: 
//	seriesArray
	seriesMongo
	
} );