
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

interface MediaTrackConstraints {
  cursor?: string;
  displaySurface?: string;
}

declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  grabFrame(): Promise<ImageBitmap>;
}
