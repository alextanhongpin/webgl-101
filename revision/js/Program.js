const Program = (function () {
	
	'use strict';
	function Program () {
	}
	
	Program.prototype.setContext = function (ctx) {
		this.gl = ctx;
	}
	
	
	Program.prototype.makeShader = function (src, type) {
		// type: gl.VERTEX_SHADER, gl.FRAGMENT_SHADER
		let shader = gl.createShader(type);
		this.gl.shaderSource(shader, src);
		this.gl.compileShader(shader);
	
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			alert('Error compiling shader: ' + this.gl.getShaderInfoLog(shader));
		}
		return shader;
	}
	
	Program.prototype.initShaders = function (vs_src, fs_src) {
		let vs_source = vs_src;
		let fs_source = fs_src;
	
		let vertexShader = this.makeShader(vs_source, this.gl.VERTEX_SHADER);
		let fragmentShader = this.makeShader(fs_source, this.gl.FRAGMENT_SHADER);
	
		program = this.gl.createProgram();
	
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
	
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program.');
		}
		this.gl.useProgram(program);
	}
	
	return Program;
})();
