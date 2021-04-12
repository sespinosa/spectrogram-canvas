import { useRef, useEffect } from 'react';
import Recorder from './utils/pcm-processor';
import Plotter from './utils/plotter';
import './App.css';

const App = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const initRecording = async () => {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
      const stop = await Recorder(chunk => {
        Plotter(canvasRef.current, ctx, chunk);
      });
      return () => {
        stop();
      };
    };
    initRecording();
  }, [canvasRef]);

  console.log('render');

  return (
    <section className="main-app">
      <div className="main-container">
        <canvas
          ref={canvasRef}
          className="spectro-canvas"
        />
      </div>
    </section>
  );
}

export default App;
