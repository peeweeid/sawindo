// components/GLTFViewer.js
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useCursor,OrthographicCamera , Environment } from '@react-three/drei';
import Modal from 'react-modal';
import * as THREE from 'three';
// Set up the modal root element
Modal.setAppElement('#__next');

const Model = ({ url, onObjectClick }) => {
  const group = useRef();
  const [hoveredObject, setHoveredObject] = useState(null);
  const { nodes, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const [cursor, setCursor] = useState(false);

  useCursor(cursor); // Set cursor state

  useEffect(() => {
    const animNames = ['HandR2','tambang','tangan','idlePanelnew','botol','tangan2','tangan3','effect1Action','effect2Action','taliLomba2','taliLomba1','HandL2','char1','char2','char3','idlePanel', 'HandR1', 'daun5', 'idleTouch1','idleTouch2','idleTouch3','idleTouch4','idleKomen1','idleKomen2','idleKomen3','idleKomen4','handL1', 'hand5', 'daun1', 'daun2', 'daun3', 'paku', 'daun4', 'bendera1', 'kardus1', 'Box1', 'Bola1', 'Ciduk1'];
    animNames.forEach((anim) => {
      if (actions[anim]) {
        actions[anim].play();
      }
    });
  }, [actions]);

  const handlePointerDown = (event) => {
    if (event.object.name === 'touch1') {
      actions['idleKomen1'].reset().stop();
        actions['komen1'].reset().play();
        actions['komen1'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['komen1'].clampWhenFinished = true; // Ensure the animation doesn't loop

       
       
      // Trigger click interaction
      onObjectClick();
    }
    if (event.object.name === 'touch2') {
      actions['idleKomen2'].reset().stop();
        actions['komen2'].reset().play();
        actions['komen2'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['komen2'].clampWhenFinished = true; // Ensure the animation doesn't loop

       
       
      // Trigger click interaction
      onObjectClick();
    }
    if (event.object.name === 'touch4') {
      actions['idleKomen4'].reset().stop();
      actions['taliLomba2'].reset().stop();
      actions['taliLomba1'].reset().stop();
      actions['char1'].reset().stop();
        actions['komen4'].reset().play();
        actions['komen4'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['komen4'].clampWhenFinished = true; // Ensure the animation doesn't loop
        actions['cahr1b'].reset().play();
        actions['cahr1b'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['cahr1b'].clampWhenFinished = true; 
        actions['taliLomba1b'].reset().play();
        actions['taliLomba1b'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['taliLomba1b'].clampWhenFinished = true; 
        actions['taliLomba2b'].reset().play();
        actions['taliLomba2b'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['taliLomba2b'].clampWhenFinished = true; 
       
       
      // Trigger click interaction
      onObjectClick();
    }
    if (event.object.name === 'touch3') {
      actions['idleKomen3'].reset().stop();
      actions['paku'].stop();
        actions['komen3'].reset().play();
        actions['komen3'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['komen3'].clampWhenFinished = true; // Ensure the animation doesn't loop
        actions['paku2'].reset().play();
        actions['paku2'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['paku2'].clampWhenFinished = true;
       
       
      // Trigger click interaction
      onObjectClick();
    }
  };

  useFrame(({ raycaster }) => {
    const intersects = raycaster.intersectObjects(Object.values(nodes));
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.name === 'touch1') {
        setHoveredObject(intersected);
        setCursor(true); // Update cursor state
      }
      if (intersected.name === 'touch2') {
        setHoveredObject(intersected);
        setCursor(true); // Update cursor state
      }
      if (intersected.name === 'touch3') {
        setHoveredObject(intersected);
        setCursor(true); // Update cursor state
      }
      if (intersected.name === 'touch4') {
        setHoveredObject(intersected);
        setCursor(true); // Update cursor state
      }
    } else {
      setHoveredObject(null);
      setCursor(false); // Update cursor state
    }
  });

  useFrame(() => {
    if (group.current) {
      const { rotation } = group.current;

      // Limit rotation values to -5° to 5°
      const limit = Math.PI / 36; // 5 degrees in radians
      rotation.x = Math.min(Math.max(rotation.x, -limit), limit);
      rotation.y = Math.min(Math.max(rotation.y, -limit), limit);
      rotation.z = Math.min(Math.max(rotation.z, -limit), limit);
    }
  });

  return (
    <group ref={group} dispose={null}>
      
      {Object.values(nodes).map((object) => (
        <mesh
          key={object.uuid}
          geometry={object.geometry}
          material={object.material}
          position={object.position}
          name={object.name}
           onClick={handlePointerDown}
        />
      ))}
    </group>
  );
};

const GLTFViewer2 = () => {
  const modelUrl = '/models/komik.gltf'; // URL model GLTF
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [audio, setAudio] = useState(null);

  // Function to handle object click
  const handleObjectClick = () => {
    setModalIsOpen(true); // Open modal
    const newAudio = new Audio('/audio/sfx.mp3'); // Audio file path
    setAudio(newAudio); // Save reference to the audio
    newAudio.play(); // Play audio
  };

  // Function to close the modal and stop audio
  const closeModal = () => {
    setModalIsOpen(false);
    if (audio) {
      audio.pause(); // Pause the audio
      audio.currentTime = 0; // Reset the audio
    }
  };

  return (
    <div className="w-full lg:h-[800px] h-[400px] ">
      <Canvas
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
      }}
      >
      <Environment files="/hdr/studio2.hdr" background /> {/* Ganti dengan path HDRI Anda */}
      <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={70} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 5]} intensity={0.5}  shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <directionalLight position={[0, -10, 5]} intensity={0.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
        <Model url={modelUrl} onObjectClick={handleObjectClick} />
        <OrbitControls 
          minPolarAngle={Math.PI / 2} // Min angle for vertical rotation
          maxPolarAngle={Math.PI / 2} // Max angle for vertical rotation (90 degrees)
          minAzimuthAngle={-Math.PI / 8} // Min angle for horizontal rotation
          maxAzimuthAngle={Math.PI / 8} // Max angle for horizontal rotation (45 degrees)
          enableRotate={true} // Disable rotation
          enablePan={false} // Optionally, disable panning as well
           minDistance={5} // Minimum distance for zoom
           maxDistance={5} // Maximum distance for zoom
          enableZoom={true} // Enable zoom
        />
      </Canvas>

      {/* Modal Component */}
      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Info Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg h-[70%] max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Object Information</h2>
          <p className="text-gray-700 mb-6">This is some information about the object.</p>
          <div className="flex justify-between">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={closeModal}
            >
              Close
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={closeModal}
            >
              Stop Audio
            </button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};

export default GLTFViewer2;
