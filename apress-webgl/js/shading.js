/*

vertex-shader

attribute vec2 aVertexTexCoord;
varying highp vec2 vTextureCoord;
void main (void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	vTextureCoord = aVertexTexCoord;
}

fragment-shader

varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
void main(void) {
	gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
}
*/
/* LAMBERTIAN REFLECTION MODEL + GORAUD SHADING 

VERTEX-SHADER

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec3 vLightDirection;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;
varying vec4 vFinalColor;

void main(void) {
	vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0));
	vec3 L = normalize(uLightDirection);

	float lambertTerm = dot(N, -L);
	
	vFinalColor = uMaterialDiffuse * uLightDiffuse * lambertTerm + aVertexColor;
	vFinalColor.a = 1.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
FRAGMENT SHADER 
varying highp vFinalColor;

void main(void) {
	gl_FragColor = vFinalColor;
}
*/

/* GORAUD SHADING WITH PHONG REFLECTIONS
VERTEX SHADER
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float uShininess;

uniform vec3 uLightDirection;
uniform vec4 uLightDiffuse;
uniform vec4 uLightAmbient;
uniform vec4 uLightSpecular;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialSpecular;
uniform vec4 uMaterialDiffuse;
uniform vec4 vFinalColor;
void main (void) {
	vec4 vertex = uMVMatrix  vec4(aVertexPosition, 1.0);
	vec3 N = vec3(uNMatrix * vec4(aVertexNormal, 1.0));
	vec3 L = normalize(uLightDirection);
	float lambertTerm = clamp(dot(N,-L), 0.0, 1.0);
	
	vec4 Ia = uLightAmbient * uMaterialAmbient; 
	vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
	vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

	Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;
	
	vec3 eyeVec = -vec3(vertex.xyz);
	vec3 E = normalize(eyevec);
	vec3 R = reflect(L, N);
	float specular = pow(max(dot(R, E), 0.0), uShininess);

	Is = uLightSpecular * uMaterialSpecular * specular;
	
	vFinalColor = Ia + Id + Is;
	vFinalColor.a = 1.0;

	gl_Position = uPMatrix * vertex;
}
FRAGMENT SHADER 
varying highp vFinalColor;

void main(void) {
	gl_FragColor = vFinalColor;
}

*/

/* Phong shading + phong lighting 

VERTEXSHADER

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vNormal;
varying vec3 vEyeVec;

void main(void) {
	vec4 vertex = uMVMatrix * vec4(aVertexPosition, 1.0);
	vNormal = vec3(uNMatrix * vec4(aVertexNormal, 1.0));
	vEyeVec = -vec3(vertex.xyz);
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}

FRAGMENT_SHADER

uniform float uShininess;
uniform vec3 uLightDirection;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uLightSpecular;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
varying vec3 vNormal;
varying vec3 vEyeVec;

void main(void) {
	vec3 L = normalize(uLightDirection);
	vec3 N = normalize(vNormal);

	float lambertTerm = dot(N, -L);
	vec4 Ia = uLightAmbient * uMaterialAmbient;
	vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
	vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

	if (lambertTerm > 0.0) {
		Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

		vec3 E = normalize(vEyeVec);
		vec3 R = reflect(L, N);
		float specular = pow(max(dot(R, E), 0.0), uShininess);

		Is = uLightSpecular * uMaterialSpecular * specular;
	}

	vec4 vFinalColor = Ia + Id + Is;
	finalColor.a = 1.0;

	gl_FragColor = finalColor;
}
*/