import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./fragment.glsl?raw";

type Props = {
  image: HTMLImageElement;
  color: string;
  outlineWidth: number;
};

export type OutlinePreviewMethods = {
  getDataURL(): string | undefined;
};

export const OutlinePreview = forwardRef<OutlinePreviewMethods, Props>(
  ({ image, color, outlineWidth }, ref) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => ({
      getDataURL() {
        return canvas.current?.toDataURL();
      },
    }));
    const material = useRef<THREE.ShaderMaterial>(
      new THREE.ShaderMaterial({
        uniforms: {
          resolution: { value: new THREE.Vector2(0, 0) },
          image: { value: new THREE.TextureLoader().load(image.src) },
          color: { value: new THREE.Color(color) },
          outlineWidth: { value: outlineWidth },
        },
        vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
        fragmentShader,
      })
    );
    const rerender = useRef(() => {});

    useEffect(() => {
      const texture = new THREE.Texture();
      texture.image = image;
      texture.needsUpdate = true;
      material.current.uniforms.image.value = texture;
      material.current.needsUpdate = true;
    }, [image]);

    useEffect(() => {
      if (!canvas?.current) return;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        -1, // left
        1, // right
        1, // top
        -1, // bottom
        -1, // near,
        1 // far
      );

      const plane = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(plane, material.current));

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas.current,
        preserveDrawingBuffer: true,
      });
      material.current.uniforms.resolution.value = new THREE.Vector2(
        image.width,
        image.height
      );

      renderer.render(scene, camera);

      rerender.current = () => renderer.render(scene, camera);

      return () => {
        renderer.dispose();
        rerender.current = () => {};
      };
    }, [image.height, image.width]);

    useEffect(() => {
      material.current.uniforms.color.value = new THREE.Color(color);
      material.current.uniforms.outlineWidth.value = outlineWidth;
      material.current.needsUpdate = true;
      rerender.current();
    }, [color, outlineWidth]);

    return (
      <canvas
        className="max-w-full mx-auto my-2 bg-[url('/checkers.svg')]"
        id="canvas"
        ref={canvas}
        width={image.width}
        height={image.height}
      />
    );
  }
);
