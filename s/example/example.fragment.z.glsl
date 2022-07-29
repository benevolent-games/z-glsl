
precision highp float;

uniform float time;
uniform vec3 cameraPosition;

uniform sampler2D myTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vWorldPosition;

#import utils/noise.glsl

void main(void) {
	vec3 direction = normalize(cameraPosition - vWorldPosition.xyz);
	vec4 tex = texture2D(myTexture, vUv);
	vec3 color = direction * tex.xyz;
	float strobe = mod(time, 3000.0) / 3000.0;
	float final = noise(vUv) * (color + strobe * 0.5);
	gl_FragColor = vec4(final, 1.0);
}
