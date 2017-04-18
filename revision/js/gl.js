// define global variables

var gl = null;
var glProgram = null;

// start function
var GL = (function () {
	
	var App = {};
	
 	App.gl = null;
	App.program = null;
	
	var canvas = null;
	var	fragmentShader = null,
		vertexShader = null;

	var vertexPositionAttribute = null,
		vertexColorAttribute = null,
		vertexTexCoordAttribute = null,
		vertexNormalAttribute = null,
		verticeBuffer = null,
		colorBuffer = null,
		textureBuffer = null,
		normalBuffer = null,
		indexBuffer = null;
	
	var FOCAL = 50;
    var mvMatrix = mat4.create(),
        pMatrix  = mat4.create(),
		normalMatrix = mat4.create(),
		cameraMatrix = mat4.create();
	
		var matrixStack = [];
		
		var rotationMatrix = mat4.create();
		mat4.identity(rotationMatrix);
	
	var textureSkin = null,
		texture = null;
	var angle = 0.0;
	
	var mouseDown = false;
	var mouseX = null,
		mouseY = null;
	var viewZ = -7;
	var viewY = 0;
	var gravity = 9.8 / 30;
	
	var renderbuffer = null;
	var framebuffer = null;
	var offscreenTexture = null;
	
	App.setupCanvas = function () {
		canvas = document.getElementById('canvas');
		canvas.height = window.innerHeight;
		canvas.width  = window.innerWidth;
		try {
			App.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		} catch (err) {
			if (err) throw err;
		}
		canvas.addEventListener('mousedown', Mousedown, false);
		document.addEventListener('mousemove', Mousemove, false);
 	   document.addEventListener('mousewheel', Zoom, false)
		
		canvas.addEventListener('mouseup', Mouseup, false);
		
		if (App.gl) return true;
	}
	
	function Mousedown (evt) {
		mouseDown = true;
		mouseX = evt.clientX;
		mouseY = evt.clientY;
		
		var rect = canvas.getBoundingClientRect();
		var realX = mouseX - rect.left;
		var realY = mouseY - rect.top;
		
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, framebuffer);
		var pixelValues = new Uint8Array(4);
		App.gl.readPixels(realX, canvas.height - realY, 1, 1, App.gl.RGBA, App.gl.UNSIGNED_BYTE, pixelValues);
		console.log(pixelValues);
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, null);
	}
	function Mousemove (evt) {
		
		if (!mouseDown) return;
		var newX = evt.clientX;
		var newY = evt.clientY;
		
		var dx = newX - mouseX;
		var dy = newY - mouseY; 
		
		var newRotationMatrix = mat4.create();
		mat4.identity(newRotationMatrix);
		mat4.translate(newRotationMatrix, [0.5, 0.5, -0.5]);
		mat4.rotate(newRotationMatrix, degToRad(dx / 2), [0, 1.0, 0]);
		mat4.rotate(newRotationMatrix, degToRad(dy / 2), [1.0, 0, 0]);
		mat4.translate(newRotationMatrix, [-0.5, -0.5, 0.5]);
		mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);
		
		mouseX = newX;
		mouseY = newY;
		//mat4.multiply(rotationMatrix, mvMatrix, mvMatrix);
	}
	function Mouseup (evt) {
		mouseDown = false;
	}
	
	function degToRad (degree) {
		return degree * Math.PI / 180;
	}
	function Zoom (evt) {
		evt.preventDefault();
		console.log(evt.wheelDelta);
		viewZ += evt.wheelDelta / 1200;
	}
	
	App.setupWebGL = function () {
		//App.gl.clearColor(0.2, 0.3, 0.4, 1.0);
		App.gl.clearColor(1.0, 1.0, 1.0, 1.0);
		App.gl.clear(App.gl.COLOR_BUFFER_BIT | App.gl.DEPTH_BUFFER_BIT);
		App.gl.enable(App.gl.DEPTH_TEST);
		App.gl.viewport(0, 0, canvas.width, canvas.height);
		
		// transparency
		//App.gl.disable(App.gl.DEPTH_TEST);
		//App.gl.enable(App.gl.BLEND);
		//App.gl.blendFunc(App.gl.SRC_ALPHA, App.gl.ONE_MINUS_SRC_ALPHA);
	}
	App.initTransform = function () {
		
		
		viewY = 0;//5 * Math.sin(angle);
		
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0, viewY, viewZ]);
		
		//mat4.rotate(mvMatrix, angle, [0.2, 0.1, 0.5]);
		angle += 0.01;
		mat4.multiply(mvMatrix, rotationMatrix);
		
		mat4.identity(cameraMatrix);
		mat4.inverse(mvMatrix, cameraMatrix); // the camera matrix is the inverse of the model view matrix;
		
		mat4.identity(pMatrix);
		mat4.perspective(FOCAL, canvas.width / canvas.height, 0.1, 100.0, pMatrix);
		
		mat4.identity(normalMatrix);
		mat4.set(mvMatrix, normalMatrix);
		mat4.inverse(normalMatrix);
		mat4.transpose(normalMatrix);
		//mat4.toInverseMat3(mvMatrix, normalMatrix);
		//mat3.transpose(normalMatrix);
		
		
	}
	
	App.pushMatrix = function () {
		var copy = mat4.create();
		mat4.set(mvMatrix, copy);
		matrixStack.push(copy);
	}
	
	App.popMatrix = function () {
		if (matrixStack.length == 0) return;
		mvMatrix = matrixStack.pop();
	}
	
	App.initShaders = function () {
		var fs_source = document.getElementById('fragment-shader').innerHTML;
		var vs_source = document.getElementById('vertex-shader').innerHTML;
		
		var vertexShader = App.makeShader(vs_source, App.gl.VERTEX_SHADER);
		var fragmentShader = App.makeShader(fs_source, App.gl.FRAGMENT_SHADER);
		
		App.program = App.gl.createProgram();
		App.gl.attachShader(App.program, fragmentShader);
		App.gl.attachShader(App.program, vertexShader);
		App.gl.linkProgram(App.program);
		
		if (!App.gl.getProgramParameter(App.program, App.gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program');
		}
		App.gl.useProgram(App.program);
	}
	
	App.makeShader = function (src, type) {
		var shader = App.gl.createShader(type);
		App.gl.shaderSource(shader, src);
		App.gl.compileShader(shader);
		
		if (!App.gl.getShaderParameter(shader, App.gl.COMPILE_STATUS)) {
			alert('Error compiling shader: ' + App.gl.getShaderInfoLog(shader));
		}
		return shader;
	}
	
	// use to setup vertex buffers
	App.setupVertexBuffer = function (verticesArray) {
		var geometryVertices = verticesArray;
		verticeBuffer = App.gl.createBuffer();
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, verticeBuffer);
		App.gl.bufferData(App.gl.ARRAY_BUFFER, new Float32Array(geometryVertices), App.gl.STATIC_DRAW);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, null);
	}
	
	// use to setup color buffers
	App.setupColorBuffer = function (colorsArray) {
		var colorVertices = colorsArray;
		colorBuffer = App.gl.createBuffer();
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, colorBuffer);
		App.gl.bufferData(App.gl.ARRAY_BUFFER, new Float32Array(colorVertices), App.gl.STATIC_DRAW);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, null);
	}
	
	App.setupTextureBuffer = function (textureArray) {
		var textureCoords = textureArray;
		textureBuffer = App.gl.createBuffer();
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, textureBuffer);
		App.gl.bufferData(App.gl.ARRAY_BUFFER, new Float32Array(textureCoords), App.gl.STATIC_DRAW);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, null);
	}
	
	App.setupIndexBuffer = function (indicesArray) {
		var indexVertices = indicesArray;
		indexBuffer = App.gl.createBuffer();
		indexBuffer.number_vertex_points = indexVertices.length;
		App.gl.bindBuffer(App.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		App.gl.bufferData(App.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexVertices), App.gl.STATIC_DRAW);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, null);
		
	}
	App.setupNormalBuffer = function (normalArray) {
		var normalVertices = normalArray;
		normalBuffer = App.gl.createBuffer();
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, normalBuffer);
		App.gl.bufferData(App.gl.ARRAY_BUFFER, new Float32Array(normalVertices), App.gl.STATIC_DRAW);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, null);
	}
	
	App.setVertexPositionAttribute = function () {
        vertexPositionAttribute = App.gl.getAttribLocation(App.program, 'aVertexPosition');
        App.gl.enableVertexAttribArray(vertexPositionAttribute);
        App.gl.bindBuffer(App.gl.ARRAY_BUFFER, verticeBuffer);
        App.gl.vertexAttribPointer(vertexPositionAttribute, 3, App.gl.FLOAT, false, 0, 0);
	}
	
	App.setVertexColorAttribute = function () {
		vertexColorAttribute = App.gl.getAttribLocation(App.program, 'aVertexColor');
		App.gl.enableVertexAttribArray(vertexColorAttribute);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, colorBuffer);
		App.gl.vertexAttribPointer(vertexColorAttribute, 3, App.gl.FLOAT, false, 0, 0);
	}
	
	App.setTextureCoordinateAttribute = function () {
		vertexTexCoordAttribute = App.gl.getAttribLocation(App.program, 'aVertexTexCoord');
		App.gl.enableVertexAttribArray(vertexTexCoordAttribute);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, textureBuffer);
		App.gl.vertexAttribPointer(vertexTexCoordAttribute, 2, App.gl.FLOAT, false, 0, 0);
	}
	App.setVertexNormalAttribute = function () {
		vertexNormalAttribute = App.gl.getAttribLocation(App.program, 'aVertexNormal');
		App.gl.enableVertexAttribArray(vertexNormalAttribute);
		App.gl.bindBuffer(App.gl.ARRAY_BUFFER, normalBuffer);
		App.gl.vertexAttribPointer(vertexNormalAttribute, 3, App.gl.FLOAT, false, 0, 0);
	}
	
	App.loadTexture = function (path) {
		textureSkin = new Image();
		textureSkin.onload = function () {
			App.setupTexture();
		}
		textureSkin.src = path;
	}
	
	App.setupTexture = function () {
		texture = App.gl.createTexture();
		App.gl.bindTexture(App.gl.TEXTURE_2D, texture);
		App.gl.pixelStorei(App.gl.UNPACK_FLIP_Y_WEBGL, true);
		App.gl.texImage2D(App.gl.TEXTURE_2D, 0, App.gl.RGBA, App.gl.RGBA, App.gl.UNSIGNED_BYTE, textureSkin);
		App.gl.texParameteri(App.gl.TEXTURE_2D, App.gl.TEXTURE_MAG_FILTER, App.gl.NEAREST);
		App.gl.texParameteri(App.gl.TEXTURE_2D, App.gl.TEXTURE_MIN_FILTER, App.gl.NEAREST);
		
		App.gl.uniform1i(App.program.uSampler, 0);
		if (App.gl.isTexture(texture)) {
			console.log('Texture is invalid.');
		}
	}
	
	
	App.setMatrixUniform = function () {
		App.gl.uniformMatrix4fv(App.program.pMatrixUniform, false, pMatrix);
		App.gl.uniformMatrix4fv(App.program.mvMatrixUniform, false, mvMatrix);
		App.gl.uniformMatrix4fv(App.program.normalMatrixUniform, false, normalMatrix);
	}
	
	App.getMatrixUniform = function () {
		App.program.pMatrixUniform  = App.gl.getUniformLocation(App.program, 'uPMatrix');
		App.program.mvMatrixUniform = App.gl.getUniformLocation(App.program, 'uMVMatrix');
		App.program.samplerUniform  = App.gl.getUniformLocation(App.program, 'uSampler');
		App.program.normalMatrixUniform = App.gl.getUniformLocation(App.program, 'uNormalMatrix');
		
		
	}
	
	App.setupLights = function () {
		App.program.uLightDirection = App.gl.getUniformLocation(App.program, 'uLightDirection');
		App.program.uShininess = App.gl.getUniformLocation(App.program, 'uShininess');
		
		App.program.uLightAmbient = App.gl.getUniformLocation(App.program, 'uLightAmbient');
		App.program.uLightDiffuse = App.gl.getUniformLocation(App.program, 'uLightDiffuse');
		App.program.uLightSpecular = App.gl.getUniformLocation(App.program, 'uLightSpecular');
		
		App.program.uMaterialDiffuse = App.gl.getUniformLocation(App.program, 'uMaterialDiffuse');
		App.program.uMaterialAmbient = App.gl.getUniformLocation(App.program, 'uMaterialAmbient');
		App.program.uMaterialSpecular = App.gl.getUniformLocation(App.program, 'uMaterialSpecular');
	}
	
	App.initLights = function () {
		App.gl.uniform1f(App.program.uShininess, 200.0); 
		App.gl.uniform3fv(App.program.uLightDirection, [0.0, 0.5, -1.0]);
		
		App.gl.uniform4fv(App.program.uLightAmbient, [0.01, 0.01, 0.01, 1.0]);
		App.gl.uniform4fv(App.program.uLightDiffuse, [0.5, 0.1, 0.1, 1.0]);
		App.gl.uniform4fv(App.program.uLightSpecular, [0.5, 0.1, 0.1, 1.0]);
		
		App.gl.uniform4fv(App.program.uMaterialDiffuse, [0.5, 0.1, 0.1, 1.0]);
		App.gl.uniform4fv(App.program.uMaterialAmbient, [0.5, 0.1, 0.1, 1.0]);
		App.gl.uniform4fv(App.program.uMaterialSpecular, [0.5, 0.1, 0.1, 1.0]);
	}
	
	App.drawScene = function () {
		App.gl.drawArrays(App.gl.TRIANGLES, 0, 6);
		
        /*
        to render lines instead of triangle
        
        gl.drawArrays(gl.LINES, 0, 2);
        gl.drawArrays(gl.LINES, 2, 2);
        gl.drawArrays(gl.LINES, 4, 2);
        */
        
        /*
        to render points
        gl.drawArrays(gl.POINTS, 0, 6);
        gl_PointSize = 5.0;
        */
	}
	
	App.calculateNormals = function (vertices, indices) {
		/*
		p0, p1, p2
		U = p1 - p0 or p1.x  p0.x, p1.y - p0.y.....
		V = p2 - p0
		N = U x V
		
		*/
		var normalArrays = [];
		for (var i = 0; i < indices.length; i += 3) {
			var p0 = indices[i + 0];
			var p1 = indices[i + 1];
			var p2 = indices[i + 2];
			
			var U = [
				vertices[p1 * 3 + 0] - vertices[p0 * 3 + 0], 
				vertices[p1 * 3 + 1] - vertices[p0 * 3 + 1],
				vertices[p1 * 3 + 2] - vertices[p0 * 3 + 2]
			];
			var V = [
				vertices[p2 * 3 + 0] - vertices[p0 * 3 + 0], 
				vertices[p2 * 3 + 1] - vertices[p0 * 3 + 1],
				vertices[p2 * 3 + 2] - vertices[p0 * 3 + 2]
			];
			var N = [
				U[1] * V[2] - U[2] * V[1],
				U[2] * V[0] - U[0] * V[2],
				U[0] * V[1] - U[1] * V[0],
			];
			// same value for each of the three vertices
			normalArrays.push.apply(normalArrays, N);
			normalArrays.push.apply(normalArrays, N);
			normalArrays.push.apply(normalArrays, N);

		}
		console.log(normalArrays);
		return normalArrays;
	}
	var normals = [];
	App.normalValues = function (vertices, indices) {
		
		normals.push(App.normalOperation(0,1,3,vertices, indices));
		normals.push(App.normalOperation(0,1,3,vertices, indices));
		normals.push(App.normalOperation(0,1,3,vertices, indices));
		normals.push(App.normalOperation(0,1,3,vertices, indices));
		normals.push(App.normalOperation(0,1,3,vertices, indices));
		normals.push(App.normalOperation(0,1,3,vertices, indices));

		normals.push(App.normalOperation(7,8,10,vertices, indices));
		normals.push(App.normalOperation(7,8,10,vertices, indices));
		normals.push(App.normalOperation(7,8,10,vertices, indices));
		normals.push(App.normalOperation(7,8,10,vertices, indices));
		normals.push(App.normalOperation(7,8,10,vertices, indices));
		normals.push(App.normalOperation(7,8,10,vertices, indices));

		console.log(normals.length);
		console.log(normals);
		return normals;
	}
	App.normalOperation = function (x, y, z, vertices, indices) {
		var p0 = indices[x];
		var p1 = indices[y];
		var p2 = indices[z];
		
		var U = [
			vertices[p1 + 0] - vertices[p0 + 0], 
			vertices[p1 + 1] - vertices[p0 + 1],
			vertices[p1 + 2] - vertices[p0 + 2]
		];
		var V = [
			vertices[p2 + 0] - vertices[p0 + 0], 
			vertices[p2 + 1] - vertices[p0 + 1],
			vertices[p2 + 2] - vertices[p0 + 2]
		];
		var N = [
			U[1] * V[2] - U[2] * V[1],
			U[2] * V[0] - U[0] * V[2],
			U[0] * V[1] - U[1] * V[0],
		];
		return N;
	}
	
	App.drawElements = function () {
		App.gl.drawElements(App.gl.TRIANGLES, indexBuffer.number_vertex_points, App.gl.UNSIGNED_SHORT, 0);
	}
	
	App.picking = function () {
		offscreenTexture = App.gl.createTexture();
		App.gl.bindTexture(App.gl.TEXTURE_2D, offscreenTexture);
		App.gl.texImage2D(App.gl.TEXTURE_2D, 0, App.gl.RGBA, canvas.width, canvas.height, 0, App.gl.RGBA, App.gl.UNSIGNED_BYTE, null);
		
		renderbuffer = App.gl.createRenderbuffer();
		App.gl.bindRenderbuffer(App.gl.RENDERBUFFER, renderbuffer);
		App.gl.renderbufferStorage(App.gl.RENDERBUFFER, App.gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
		
		framebuffer = App.gl.createFramebuffer();
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, framebuffer);
		App.gl.framebufferTexture2D(App.gl.FRAMEBUFFER, App.gl.COLOR_ATTACHMENT0, App.gl.TEXTURE_2D, offscreenTexture, 0);
		App.gl.framebufferRenderbuffer(App.gl.FRAMEBUFFER, App.gl.DEPTH_ATTACHMENT, App.gl.RENDERBUFFER, renderbuffer);
		App.gl.bindTexture(App.gl.TEXTURE_2D, null);
		App.gl.bindRenderbuffer(App.gl.RENDERBUFFER, null);
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, null);
		
		App.program.uOffscreen = App.gl.getUniformLocation(App.program, 'uOffscreen');
	}
	
	App.render = function () {
		// off-screen rendering
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, framebuffer);
		App.gl.uniform1i(App.program.uOffscreen, true);
		App.drawElements();
		
		// on-screen rendering
		App.gl.bindFramebuffer(App.gl.FRAMEBUFFER, null);
		App.gl.uniform1i(App.program.uOffscreen, false);
		App.drawElements();
		/*
fragment shader
   void main(void) {
       if(uOffscreen){
           gl_FragColor = uMaterialDiffuse;
￼return; }
... }‚
		*/
	}
	
	return App;
})(GL || {});
	
	