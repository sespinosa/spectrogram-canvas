// const amplitude = Math.pow(2, 16);

// const justifyCord = (w, h, l) => {
//   const segmentX = w/l;
//   const segmentY = (h)/amplitude;
//   return [segmentX, segmentY];
// };

// const plotter = (canvas, ctx, chunk) => {
//   const [sx, sy] = justifyCord(canvas.width, canvas.height, chunk.length);

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const absArr = Array.from(chunk.map(frame => {
//     return Math.round((frame * amplitude/2) + (amplitude/2));
//   }));

//   window.lastSample = absArr;

//   ctx.beginPath(0, 0);
//   absArr.forEach((p, i) => {
//     const x = Math.round(sx * i);
//     const y = Math.round(sy * p);
//     ctx.lineTo(x, y);
//     ctx.moveTo(x, y);
//   });

//   ctx.stroke();

// };

// window.samples = [...Array(60).fill(0)];
// window.samplesX = [];
// window.samplesY = [];

// const plotter2 = (canvas, ctx, chunk) => {
//   // const [sx, sy] = justifyCord(canvas.width, canvas.height, chunk.length);

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   const absArr = Array.from(chunk.map(frame => {
//     return (frame * (amplitude));
//   }));

//   const max = absArr.reduce((acc, v) => {
//     // return acc + (v / absArr.length);
//     return Math.max(acc, Math.abs(v))
//   }, 0);

//   window.samples.push(max);

//   const sx = canvas.width / 60;
//   const sy = Math.abs(canvas.height / (amplitude));

//   ctx.beginPath(sx/2, (canvas.height - (sx/2)));

//   const usableHeight = canvas.height - (sx/2);

//   window.samples = window.samples.slice(-60);
//   window.samples.forEach((p, i) => {
//     const x = (sx/2) + Math.round(sx * i);
//     const y = usableHeight - (Math.round(sy * p));
//     const ratio = sx/2.2;
//     const diameter = ratio*2;
//     const circleCount = Math.floor(usableHeight/diameter);

//     for(let i = 0 ; i < circleCount ; i++) {
//       const ty = y + (diameter * i);
//       ctx.moveTo(x, ty);
//       ctx.arc(x, ty, ratio, 0, Math.PI * 2);
//     }
//     ctx.strokeStyle = 'transparent';
//     ctx.fillStyle = 'green';
//     ctx.fill();

//     // ctx.stroke();

//     // ctx.lineTo(x, y);
//     // ctx.moveTo(x, y);
//     // ctx.lineWidth = 3;
//     // ctx.strokeStyle = 'purple';
//   });
//   // ctx.fill();
//   // ctx.stroke();
// };

const chunkedAverageArr = (arr, size) => {
  const out = [];
  for(let i = 0 ; i < arr.length ; i = i + size) {
    out.push(arr.slice(i, i + size).reduce((acc, v, _, chunk) => {
      // return Math.abs(acc + (v / chunk.length));
      return Math.max(acc, Math.abs(v));
    }));
  }
  return out;
};

window.sample = [...Array(16).fill(0)];

const plotter3 = (canvas, ctx, chunk) => {
  const floatSample = chunkedAverageArr(chunk, 128);
  const pxSample = floatSample.map(p => (p * canvas.height));
  window.sample = pxSample;
  if(!!window.sx) return;
  window.sx = Math.floor(canvas.width / pxSample.length);
  window.ctx = ctx;
  window.canvas = canvas;
};

const getColor = (height, p, i = 256) => {
  const proportion256 = Math.round((p/height) * 256);
  // const logShit = Math.round(p * (Math.log(proportion256) / Math.log(256)));
  // return `rgb(${proportion256}, ${256 - proportion256}, ${(256/16) * (i + 1)})`;
  return `rgba(${proportion256}, ${255 - Math.round(proportion256 / 1.5)}, 0, ${1 || (i+1)/8})`;
};

const animationFrame = () => {
  if(!!window.ctx && !!window.canvas) {
    const { canvas, ctx, sample, sx } = window;
    ctx.beginPath(0, 0);
    ctx.strokeStyle = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sample.forEach((p, i) => {
      const x = (sx/2) + Math.round(sx * i);
      const y = (canvas.height) - Math.round(p);
      const ratio = Math.round(sx / 2.2);

      ctx.beginPath(x, y);
      ctx.fillStyle = getColor(canvas.height, p, i);
      ctx.arc(x, y, ratio, 0, 2 * Math.PI);
      ctx.rect(x - ratio, y, ratio*2, canvas.height - y);
      ctx.fill();
      ctx.stroke();
    });
    // console.log(getColor(canvas.height, sample[0]));
    window.colors = sample.map((p, i) => getColor(canvas.height, p, i))
    // window.ctx.translate(0, window.canvas.height);

  }

  requestAnimationFrame(animationFrame);
};

requestAnimationFrame(animationFrame);

// setInterval(animationFrame, Math.round(1000/32));

export default plotter3;