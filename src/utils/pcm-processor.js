import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';

const micStream = new MicrophoneStream();

const recorder = async plotFunction => {
  try {
    const stream = await getUserMedia({ audio: true });
    micStream.setStream(stream);

    micStream.on('format', format => {
      console.log(format);
    });

    micStream.on('data', chunk => {
      const raw = MicrophoneStream.toRaw(chunk);
      plotFunction(raw);
    });
    return micStream.stop;
  }
  catch(e) {
    console.error(e);
  }
};

export default recorder;