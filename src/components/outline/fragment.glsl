uniform vec2 resolution;
uniform sampler2D image;
uniform vec3 color;
uniform int outlineWidth;
varying vec2 vUv;

void main() {
  vec4 inColor = texture(image, vUv);
  float alpha = inColor.w;

  if(alpha == 1.0) {
    gl_FragColor = inColor;
    return;
  }

  float minDist = float(outlineWidth) + 2.0;
  if(alpha > 0.1) {
    minDist = 0.0;
  } else {
    for(int x = -outlineWidth; x < outlineWidth; x++) {
      for(int y = -outlineWidth; y < outlineWidth; y++) {
        float dist = length(vec2(x, y));
        vec4 c = texture(image, vUv + vec2(x, y) / resolution);
        if(c.w > 0.1) {
          minDist = min(minDist, dist);
        }
      }
    }
  }
  if(minDist < float(outlineWidth + 1)) {
    float newAlpha = clamp(float(outlineWidth + 1) - minDist, 0.0, 1.0);
    gl_FragColor = vec4(mix(color.rgb, inColor.rgb, alpha), newAlpha);
  } else {
    gl_FragColor = vec4(0);
  }
}
