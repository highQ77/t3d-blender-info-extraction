import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { Vector3 } from 'three/webgpu';
import { sceneData } from './SceneData';

// blender scene to threejs scene

(async () => {

    await new Promise(reslove => {
        window.addEventListener('DOMContentLoaded', reslove)
    })
    document.body.style.margin = '0px'

    const gui = new GUI();

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0.66, 50)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 5;
    camera.lookAt(new Vector3)
    // renderer
    const renderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: true,
        stencil: true,
        depth: true
    });
    // 顏色空間設置
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // 預設背景顏色 透明
    renderer.setClearColor(0, 0.0)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    const axes = new THREE.AxesHelper(5)
    scene.add(axes);

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, metalness: .619, roughness: .666 });
    sceneData.forEach(d => {
        // new PointLightHelper()
        switch (d.type) {
            case "CAMERA":
                camera.position.set(d.location.x, d.location.y, d.location.z)
                camera.rotation.set(d.rotation_euler.x, d.rotation_euler.y, d.rotation_euler.z)
                break;
            case "LIGHT":
                // let light = new THREE.PointLight(0xffaa00)
                // light.position.set(d.location.x, d.location.y, d.location.z)
                // light.intensity = 1.68
                // scene.add(light)
                break;
            case "MESH":
                const geometry = new THREE.BoxGeometry(d.dimensions.x, d.dimensions.y, d.dimensions.z);
                const box = new THREE.Mesh(geometry, material);
                box.position.set(d.location.x, d.location.y, d.location.z)
                scene.add(box);
                break;
        }
        console.log(d)
    })

    const controls = new OrbitControls(camera, renderer.domElement);

    let lightP = new THREE.PointLight(0xffd877)
    lightP.position.set(0, 1, 0)
    lightP.intensity = 3.9
    scene.add(lightP)

    //建構環境光源
    const light = new THREE.AmbientLight(0xe0edd4);
    light.intensity = 0.85
    //將光源加進場景中
    scene.add(light);

    // 主光源
    const lightD = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightD.position.set(-5.9, 7.5, 7.26)
    lightD.intensity = 3.15
    scene.add(lightD)

    // 反射光源
    const lightFloor = new THREE.DirectionalLight(0xffffff, Math.PI)
    lightFloor.position.set(100, -100, -100)
    lightFloor.intensity = 1.55
    scene.add(lightFloor)

    let camFolder = gui.addFolder('Camera Settings')
    camFolder.add(camera.position, 'x', -10, 10).name('position x');
    camFolder.add(camera.position, 'y', -10, 10).name('position y');
    camFolder.add(camera.position, 'z', -10, 10).name('position z');
    let mainLightFolder = gui.addFolder('Env Settings')
    mainLightFolder.addColor(lightP, 'color').name('Light Color');
    mainLightFolder.add(lightP, 'intensity', 0, 50).name('Light Intensity');
    mainLightFolder.add(lightP.position, 'x', -10, 10).name('Light x');
    mainLightFolder.add(lightP.position, 'y', -10, 10).name('Light y');
    mainLightFolder.add(lightP.position, 'z', -10, 10).name('Light z');

    let materialFolder = gui.addFolder('Material')
    materialFolder.addColor(material, 'color').name('Material Color');
    materialFolder.addColor(material, 'emissive').name('Material Emissive');
    materialFolder.add(material, 'metalness', 0, 1).name('Material Metalness');
    materialFolder.add(material, 'roughness', 0, 1).name('Material Roughness');
    materialFolder.add(material, 'wireframe')

    function animate() {
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onWindowResize()

    document.body.style.background = `linear-gradient(rgb(11,11,11),rgb(99, 99, 99))`
})()