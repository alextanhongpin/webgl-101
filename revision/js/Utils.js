const Utils = (function () {
	'use strict';
	
	function Utils () {
		
	}
	
	// Check if the gl context is present
	Utils.prototype.getGLContext = function (id) {
		let canvas = document.getElementById(id);
		let gl = null;
		
		if (canvas == null) alert('There are no canvas on the page');
		else {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		
		const context = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
		
		for (let i = 0; i < context.length; i++) {
			try {
				gl = canvas.getContext(context[i]);
			} catch(e) {}
			
			if (gl) break;
		}
		
		if (gl === null) {
			alert('Could not initialize WebGL');
			return null;
		} else {
			return gl;
		}
	}
	
	Utils.prototype.loadAttributes = function (attributeList) {

		for (let i = 0; i < attributeList.length; i++) {
			let attr = attributeList[i];
			attribute[attr] = gl.getAttribLocation(program, attr);
			gl.enableVertexAttribArray(attribute[attr]);
		}
	}
	
	Utils.prototype.getUniforms = function (uniformList) {
		for (let i = 0; i < uniformList.length; i++) {
			let unif = uniformList[i];
			uniform[unif] = gl.getUniformLocation(program, unif);
		}
	}
	
	Utils.prototype.setUniforms = function (uniformList) {
		for (let i = 0; i < uniformList.length; i++) {
			let unif = uniformList[i];
			//unif != 'uSampler' && 
			if (unif != 'uNMatrix') gl.uniformMatrix4fv(uniform[unif], false, matrix[unif]);
			else gl.uniformMatrix3fv(uniform[unif], false, matrix[unif]);
		}
	}
	
	Utils.prototype.loadTexture = function (src) {
		textureImage = new Image();
		const self = this;
		textureImage.onload = function () {
			self.setupTexture();
		}.bind(this);
		textureImage.src = src;
	}
	
	Utils.prototype.setupTexture = function () {
		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.uniform1i(uniform['uSampler'], 0);
		
    if (!gl.isTexture(texture)) {
        console.log('Error: Texture is invalid.');               
    }
	}
	
	return Utils;
	
})();

// gl = Utils.getGLContext();