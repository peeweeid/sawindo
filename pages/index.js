// pages/index.js
import Head from 'next/head';
import GLTFViewer from '../components/GLTFViewer';

export default function Home() {
  return (
    <div className="w-full h-full min-h-screen bg-gray-900">
      <Head>
        <title>GLTF Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Welcome to GLTF Viewer
        </h1>
        <GLTFViewer />
      </main>
    </div>
  );
}
