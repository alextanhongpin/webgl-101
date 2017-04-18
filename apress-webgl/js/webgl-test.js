var gl = null;
var glProgram = null;

var GL = (function () {
	
	var App = App || {};
	var canvas  = null,
		context = null;
		
	var fragmentShader = null,
		vertexShader   = null;


	var stackMatrix = new Array();
	
	App.hasWebGL = function (id) {
		canvas = document.getElementById(id);
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		
		try {
			gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		} catch (err) {
			if (err) throw err;
		}
		
		if (gl) return true;
	}
	

	App.clear = function (col) {
		if (!col) col = {}
		var r = col.r || 1.0;
		var g = col.g || 0.0;
		var b = col.b || 0.0;
		var a = col.a || 1.0;
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
		// transparency?
		// gl.disable(gl.DEPTH_TEST);
		// gl.enable(gl.BLEND);
		// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
	
	App.setModelView = function (data) {
		// default to identity matrix
		this.translate = data.translate || [0.0, 0.0, 0.0];
		this.angle = data.angle || 45;
		this.rotate = data.rotate || [0.0, 0.0, 0.0];
		
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, data.translate);
		mat4.rotate(mvMatrix, data.angle, data.rotate);
	}
	
	
	App.initShaders = function (data) {
		if (!data) data = {};
		var fragmentId = data.fragment || 'fragment-shader';
		var vertexId = data.vertex || 'vertex-shader';
		var fs_source = document.getElementById(fragmentId).innerHTML;
		var vs_source = document.getElementById(vertexId).innerHTML;
		
		var vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
		var fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);
		
		glProgram = gl.createProgram();
		gl.attachShader(glProgram, fragmentShader);
		gl.attachShader(glProgram, vertexShader);
		gl.linkProgram(glProgram);
		
		if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
			alert('Unable to initalize the shader program.');
		}
		gl.useProgram(glProgram);
	}
	
	function makeShader (src, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);
	
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('Error compiling shader: ' + gl.getShaderInfoLog(shader));
		}
		return shader;
	}
	
	App.buffer = function (data) {
		if (!data) data = {};
		var verticesData = data.vertices; 
		var attributeName = data.attribute;
		var vertices = new Float32Array(data.vertices);
		var bufferType = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bufferType);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		
		var attribute = gl.getAttribLocation(glProgram, attributeName);
		gl.enableVertexAttribArray(attribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, bufferType);
		gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	
	
	return App;
})(GL || {});

