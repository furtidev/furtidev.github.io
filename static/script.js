const canvas = document.getElementById("gradient-canvas");
const gl = canvas.getContext("webgl");
if (!gl) throw new Error("WebGL not supported");

const vertexSrc = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentSrc = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // Diagonal axis (≈45°)
    float t = mod(u_time * 1.5 + uv.x + uv.y, 1.0) * 6.2831; // 0 to 2π

    // Avoid full black and white by compressing the range
    float minColor = 0.2;
    float maxColor = 0.8;

    float r = minColor + (maxColor - minColor) * (0.5 + 0.5 * sin(t));
    float g = minColor + (maxColor - minColor) * (0.5 + 0.5 * sin(t + 2.0944)); // +120°
    float b = minColor + (maxColor - minColor) * (0.5 + 0.5 * sin(t + 4.1888)); // +240°

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function compile(src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader compile failed");
  }
  return shader;
}

const vert = compile(vertexSrc, gl.VERTEX_SHADER);
const frag = compile(fragmentSrc, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vert);
gl.attachShader(program, frag);
gl.linkProgram(program);
gl.useProgram(program);

const positionLoc = gl.getAttribLocation(program, "a_position");
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1,  1, -1,  -1, 1,
  -1, 1,   1, -1,   1, 1
]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

const uTimeLoc = gl.getUniformLocation(program, "u_time");
const uResLoc = gl.getUniformLocation(program, "u_resolution");

gl.viewport(0, 0, canvas.width, canvas.width);
gl.uniform2f(uResLoc, canvas.width, canvas.width);

function animate(time) {
  gl.uniform1f(uTimeLoc, time * 0.001);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
