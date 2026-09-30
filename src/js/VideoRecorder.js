export default class VideoRecorder {
  constructor(onStop) {
    this.onStop = onStop;
    this.mediaRecorder = null;
    this.chunks = [];
    this.stream = null;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.chunks = [];

      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        this.chunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        this.stream.getTracks().forEach((track) => track.stop());

        this.onStop(url);
      });

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Не удалось получить доступ к камере', error);
    }
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }
}
