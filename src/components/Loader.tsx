'use client';
import { HashLoader } from 'react-spinners';

export default function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 100,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <HashLoader color="rgba(1, 34, 166, .88)" />
    </div>
  );
}
