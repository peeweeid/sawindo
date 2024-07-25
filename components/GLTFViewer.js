// components/GLTFViewer.js
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useCursor } from '@react-three/drei';
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
    if (actions['naik','idle']) {
      actions['naik'].play();
      actions['idle'].play();
    }
  }, [actions]);

  const handlePointerDown = (event) => {
    if (event.object.name === 'brok') {
      actions['naik'].stop();
      actions['idle'].stop();
        actions['Action'].reset().play();
        actions['Action'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['Action'].clampWhenFinished = true; // Ensure the animation doesn't loop
        actions['kotak'].reset().play();
        actions['kotak'].setLoop(THREE.LoopOnce); // Set animation to play only once
        actions['kotak'].clampWhenFinished = true; // Ensure the animation doesn't loop
       
       
      // Trigger click interaction
      onObjectClick();
    }
  };

  useFrame(({ raycaster }) => {
    const intersects = raycaster.intersectObjects(Object.values(nodes));
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      if (intersected.name === 'brok') {
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

const GLTFViewer = () => {
  const modelUrl = '/models/test3d.gltf'; // URL model GLTF
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [audio, setAudio] = useState(null);

  // Function to handle object click
  const handleObjectClick = () => {
    setModalIsOpen(true); // Open modal
    const newAudio = new Audio('/audio/suara.mp3'); // Audio file path
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
    <div className="w-full h-screen">
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <directionalLight position={[0, -10, 5]} intensity={1} />
        <Model url={modelUrl} onObjectClick={handleObjectClick} />
        <OrbitControls 
          minPolarAngle={-Math.PI / 4} // Min angle for vertical rotation
          maxPolarAngle={Math.PI / 4} // Max angle for vertical rotation (90 degrees)
          minAzimuthAngle={-Math.PI / 4} // Min angle for horizontal rotation
          maxAzimuthAngle={Math.PI / 4} // Max angle for horizontal rotation (45 degrees)
          enableRotate={true} // Disable rotation
          enablePan={false} // Optionally, disable panning as well
          minDistance={5} // Minimum distance for zoom
          maxDistance={20} // Maximum distance for zoom
          enableZoom={true} // Enable zoom
        />
      </Canvas>

      {/* Modal Component */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Info Modal"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
      </Modal>
    </div>
  );
};

export default GLTFViewer;
