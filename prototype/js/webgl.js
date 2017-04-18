var gl = null;
var glProgram = null;

var GL = (function () {
	
	var App = App || {};
	var canvas  = null,
		context = null;
		
	var fragmentShader = null,
		vertexShader   = null;
	
	var mvMatrix = mat4.create(), // model-view matrix
		pMatrix  = mat4.create(), // projection matrix
		nMatrix  = mat4.create(), // normal matrix
		cMatrix  = mat4.create(); // camera matrix

		
		
	var stackMatrix = new Array();
	
	var renderbuffer = null,
		framebuffer  = null;
	var points = null;
	var texture = null;
	
	var is_mousedown = false;
	var mouse_x = null;
	var mouse_y = null;
	
	// test
	var rotationMatrix = mat4.create();
	mat4.identity(rotationMatrix);
	var rotationMatrix2 = mat4.create();
	mat4.identity(rotationMatrix2);
	var is_movable = false;
	var is_movable2 = false;
	App.hasWebGL = function (id) {
		canvas = document.getElementById(id);
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
		
		try {
			gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		} catch (err) {
			if (err) throw err;
		}
		document.getElementById(id);
		
		if (gl) return true;
	}
	
	App.bindEvents = function () {
		document.addEventListener('mousemove', Mousemove, false);
		document.addEventListener('mousewheel', Mousewheel, false);
		canvas.addEventListener('mousedown', Mousedown, false);
		canvas.addEventListener('mouseup', Mouseup, false);
	}
	function Mouseup(evt) {
		is_mousedown = false;
		is_movable = false;
		is_movable2 = false;
	}
	function Mousedown(evt) {
		is_mousedown = true;
		mouse_x = evt.clientX;
		mouse_y = evt.clientY;
		
		var rect = canvas.getBoundingClientRect();
		var real_x = mouse_x - rect.left;
		var real_y = mouse_y - rect.top;
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		var pixelValues = new Uint8Array(4);
		gl.readPixels(real_x, canvas.height - real_y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
		console.log(pixelValues);
		if(pixelValues[0] === 0 && pixelValues[1] === 255 && pixelValues[2] === 0) {
			is_movable = true;
		}
		if(pixelValues[0] === 255 && pixelValues[1] === 0 && pixelValues[2] === 0) {
			is_movable2 = true;
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	function Mousemove(evt) {
		if (!is_mousedown) return;
		var new_x = evt.clientX;
		var new_y = evt.clientY;
		
		var dx = new_x - mouse_x;
		var dy = new_y - mouse_y; 
		
		if (is_movable) {
			var newRotationMatrix = mat4.create();
			mat4.identity(newRotationMatrix);
			mat4.translate(newRotationMatrix, [0.5, 0.5, -0.5]);
			mat4.rotate(newRotationMatrix, degToRad(dx / 2), [0, 1.0, 0]);
			mat4.rotate(newRotationMatrix, degToRad(dy / 2), [1.0, 0, 0]);
			mat4.translate(newRotationMatrix, [-0.5, -0.5, 0.5]);
			mat4.multiply(newRotationMatrix, rotationMatrix, rotationMatrix);
		}
		
		if (is_movable2) {
			var newRotationMatrix2 = mat4.create();
			mat4.identity(newRotationMatrix2);
			mat4.translate(newRotationMatrix2, [0.5, 0.5, -0.5]);
			mat4.rotate(newRotationMatrix2, degToRad(dx / 2), [0, 1.0, 0]);
			mat4.rotate(newRotationMatrix2, degToRad(dy / 2), [1.0, 0, 0]);
			mat4.translate(newRotationMatrix2, [-0.5, -0.5, 0.5]);
			mat4.multiply(newRotationMatrix2, rotationMatrix2, rotationMatrix2);
		}
		
		mouse_x = new_x;
		mouse_y = new_y;
	}
	function Mousewheel(evt) {}
	
	
	function degToRad (degree) {
		return degree * Math.PI / 180;
	}
	function Zoom (evt) {
		evt.preventDefault();
		console.log(evt.wheelDelta);
		//viewZ += evt.wheelDelta / 1200;
	}
	
	
	App.clear = function (data) {
		if (!data) data = {};
		var r = data.r || 0.0;
		var g = data.g || 0.0;
		var b = data.b || 0.0;
		var a = data.a || 0.0;
		
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, canvas.width, canvas.height);
		// transparency?
		//gl.disable(gl.DEPTH_TEST);
		//gl.enable(gl.BLEND);
		//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	}
	
	App.setModelView = function (data) {
		// default to identity matrix
		if (!data) data = {};
		mat4.identity(mvMatrix);
		var translate = data.translate || [0.0, 0.0, 0.0];
		var angle = data.angle || 45;
		var rotate = data.rotate || [0.0, 0.0, 0.0];
		
		mat4.translate(mvMatrix, translate);
		mat4.rotate(mvMatrix, angle, rotate);
	}
	App.sphereRotate = function (data) {
		angle += 0.01;
		mat4.rotate(mvMatrix, angle, [0.5, 0.5, 0.0]);
	}
	
	var angle = 0;
	App.newTranslate = function () {
		angle += 0.01;
		mat4.rotate(mvMatrix, angle, [0.0, 1.0, 0.0]);
		// test
		mat4.multiply(mvMatrix, rotationMatrix);
	}
	App.newTranslate2 = function () {
		// test
		mat4.multiply(mvMatrix, rotationMatrix2);
	}
	App.setCameraView = function (data) {
		if (!data) data = {};
		var translate = data.translate || [0.0, 0.0, 0.0];
		var angle = data.angle || 45;
		var rotate = data.rotate || [0.0, 0.0, 0.0];
		
		mat4.identity(cMatrix);
		mat4.inverse(mvMatrix, cMatrix);
		mat4.translate(cMatrix, translate);
		mat4.rotate(cMatrix, angle, rotate);		
	}
	
	App.setNormalView = function () {
		mat4.identity(nMatrix);
		mat4.set(mvMatrix, nMatrix);
		mat4.inverse(nMatrix);
		mat4.transpose(nMatrix);
	}
	
	App.setProjectionView = function (data) {
		if (!data) data = {};
		var fov = data.fov || 50;
		var min = data.min || 0.1;
		var max = data.max || 100.0;
		
		mat4.identity(pMatrix);
		mat4.perspective(fov, canvas.width / canvas.height, min, max, pMatrix);
	}

	App.pushMatrix = function () {
		var ditto = mat4.create();
		mat4.set(mvMatrix, ditto);
		stackMatrix.push(ditto); 
	}
	
	App.popMatrix = function () {
		if (stackMatrix.length === 0) return;
		mvMatrix = stackMatrix.pop();
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

	App.loadTexture = function (path) {
		var textureImg = new Image();
		textureImg.onload = function () {
			setupTexture();
		}
		textureImg.src = path;
	}
	
	function setupTexture () {
		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

		if (gl.isTexture(texture)) {
			console.log('Texture is invalid.');
		}
	}
	
	App.setMatrixUniform = function () {
		gl.uniform1i(glProgram.uSampler, 0);
		gl.uniformMatrix4fv(glProgram.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(glProgram.nMatrixUniform, false, nMatrix);
	}
	
	App.getMatrixUniform = function () {
		glProgram.mvMatrixUniform = gl.getUniformLocation(glProgram, 'uMVMatrix');
		glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, 'uPMatrix');
		glProgram.nMatrixUniform = gl.getUniformLocation(glProgram, 'uNMatrix');
		glProgram.samplerUniform = gl.getUniformLocation(glProgram, 'uSampler');
	}
	App.setupLights = function () {
		glProgram.uLightDirection = gl.getUniformLocation(glProgram, 'uLightDirection');
		glProgram.uOffscreen = gl.getUniformLocation(glProgram, 'uOffscreen');
		glProgram.uShininess = gl.getUniformLocation(glProgram, 'uShininess');
		
		glProgram.uLightAmbient  = gl.getUniformLocation(glProgram, 'uLightAmbient');
		glProgram.uLightDiffuse  = gl.getUniformLocation(glProgram, 'uLightDiffuse');
		glProgram.uLightSpecular = gl.getUniformLocation(glProgram, 'uLightSpecular');
		
		glProgram.uMaterialAmbient  = gl.getUniformLocation(glProgram, 'uMaterialAmbient');
		glProgram.uMaterialDiffuse  = gl.getUniformLocation(glProgram, 'uMaterialDiffuse');
		glProgram.uMaterialSpecular = gl.getUniformLocation(glProgram, 'uMaterialSpecular');
	}
	
	App.initLights = function (data) {
		if (!data) data = {};
		var shininess = data.shininess || 200.0;
		var lightDirection = data.lightDirection || [0.0, 0.0, 2.0];
		var lightAmbient = data.lightAmbient || [0.0, 0.0, 0.0, 1.0];
		var lightDiffuse = data.lightDiffuse || [0.0, 0.0, 0.0, 1.0];
		var lightSpecular = data.lightSpecular || [0.0, 0.0, 0.0, 1.0];
		var materialAmbient = data.materialAmbient || [0.0, 0.0, 0.0, 1.0];
		var materialDiffuse = data.materialDiffuse || [0.0, 0.0, 0.0, 1.0];
		var materialSpecular = data.materialSpecular || [0.5, 0.0, 0.0, 1.0];
		
		gl.uniform1f(glProgram.uShininess, shininess);
		gl.uniform3fv(glProgram.uLightDirection, lightDirection);
		
		gl.uniform4fv(glProgram.uLightAmbient, lightAmbient);
		gl.uniform4fv(glProgram.uLightDiffuse, lightDiffuse);
		gl.uniform4fv(glProgram.uLightSpecular, lightSpecular);
		
		gl.uniform4fv(glProgram.uMaterialAmbient, materialAmbient);
		gl.uniform4fv(glProgram.uMaterialDiffuse, materialDiffuse);
		gl.uniform4fv(glProgram.uMaterialSpecular, materialSpecular);
	}
 	
	
	
	App.picker = function () {
		var newTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, newTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		
		renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
		
		framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, newTexture, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	}
	
	App.render = function () {
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		gl.uniform1i(glProgram.uOffscreen, true);
		App.drawElements();
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.uniform1i(glProgram.uOffscreen, false);
		App.drawElements();
	}
	
	App.buffer = function (data) {
		if (!data) data = {};
		var verticesData = data.vertices; 
		var attributeName = data.attribute;
		var bufferType = null;

		this.setupBuffer = function () {
			var vertices = new Float32Array(verticesData);
			bufferType = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferType);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		};
		this.setDynamicBuffer = function () {
			var vertices = new Float32Array(verticesData);
			bufferType = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferType);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		}
		this.setAttribute = function () {
			var attribute = gl.getAttribLocation(glProgram, attributeName);
			gl.enableVertexAttribArray(attribute);
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferType);
			gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
			
		}
	}
	var indexBuffer = null;
	App.indexBuffer = function (indicesArray) {
		var indexVertices = indicesArray;
		indexBuffer = gl.createBuffer();
		indexBuffer.number_vertex_points = indexVertices.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexVertices), gl.STATIC_DRAW);
		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		
	}
	
	App.drawScene = function () {
		gl.drawArrays(gl.TRIANGLES, 0, 6);
        /*
		gl.drawArrays(gl.LINES, 4, 2);
        to render points
        gl.drawArrays(gl.POINTS, 0, 6);
        gl_PointSize = 5.0; */
	}
	
	App.drawElements = function () {
		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		//gl.drawElements(gl.TRIANGLES, indexBuffer.number_vertex_points, gl.UNSIGNED_SHORT, 0);
		//GL_POINTS, GL_LINE_STRIP, GL_LINE_LOOP, GL_LINES, GL_TRIANGLE_STRIP, GL_TRIANGLE_FAN, and GL_TRIANGLES 
		gl.drawElements(gl.TRIANGLES, indexBuffer.number_vertex_points, gl.UNSIGNED_SHORT, 0);
	}
	
	
	return App;
})(GL || {});

