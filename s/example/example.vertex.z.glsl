
precision highp float;

uniform mat4 world;
uniform mat4 worldViewProjection;
// uniform float time;

attribute vec2 uv;
attribute vec3 normal;
attribute vec3 position;

varying vec2 vUv;
varying vec4 vNormal;
varying vec3 vPosition;
varying vec4 vWorldPosition;

void main(void) {
	gl_Position = worldViewProjection * vec4(position, 1.0);
	vUv = uv;
	vNormal = normal;
	vPosition = position;
	vWorldPosition = world * vec4(position, 1.0);
}
