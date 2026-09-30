import Post from './Post';
import GeoModal from './GeoModal';
import AudioRecorder from './AudioRecorder';
import VideoRecorder from './VideoRecorder';

export default class Timeline {
  constructor(root) {
    this.root = root;
    this.posts = [];
    this.pendingText = '';
    this.pendingMedia = null;
    this.isRecording = false;
    this.isRecordingVideo = false;

    this.geoModal = new GeoModal((coords) => {
      this.addPost(this.pendingText, coords, this.pendingMedia);
    });

    this.audioRecorder = new AudioRecorder((url) => {
      this.pendingMedia = { type: 'audio', url };
      this.requestCoordsAndAdd();
    });

    this.videoRecorder = new VideoRecorder((url) => {
      this.pendingMedia = { type: 'video', url };
      this.requestCoordsAndAdd();
    });
  }

  init() {
    this.drawElements();
    this.listeners();
  }

  drawElements() {
    this.root.innerHTML = `
      <div class="timeline">
        <div class="timeline__posts"></div>
        <div class="timeline__input-wrapper">
          <input type="text" class="timeline__input" placeholder="Введите текст и нажмите Enter">
          <div class="timeline__buttons">
            <button class="timeline__btn timeline__btn-audio" title="Записать аудио">
              <span class="icon-audio">🎤</span>
            </button>
            <button class="timeline__btn timeline__btn-video" title="Записать видео">
              <span class="icon-video">📹</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.postsEl = this.root.querySelector('.timeline__posts');
    this.input = this.root.querySelector('.timeline__input');
    this.audioBtn = this.root.querySelector('.timeline__btn-audio');
    this.videoBtn = this.root.querySelector('.timeline__btn-video');
  }

  listeners() {
    this.input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.handleInput();
      }
    });

    this.audioBtn.addEventListener('click', () => {
      this.toggleAudioRecording();
    });

    this.videoBtn.addEventListener('click', () => {
      this.toggleVideoRecording();
    });
  }

  toggleAudioRecording() {
    if (this.isRecording) {
      this.audioRecorder.stop();
      this.audioBtn.classList.remove('recording');
      this.isRecording = false;
    } else {
      this.audioRecorder.start();
      this.audioBtn.classList.add('recording');
      this.isRecording = true;
    }
  }

  toggleVideoRecording() {
    if (this.isRecordingVideo) {
      this.videoRecorder.stop();
      this.videoBtn.classList.remove('recording');
      this.isRecordingVideo = false;
    } else {
      this.videoRecorder.start();
      this.videoBtn.classList.add('recording');
      this.isRecordingVideo = true;
    }
  }

  handleInput() {
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.pendingText = text;
    this.pendingMedia = null;
    this.requestCoordsAndAdd();
  }

  requestCoordsAndAdd() {
    if (!navigator.geolocation) {
      this.geoModal.show();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Успешно
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.addPost(this.pendingText, coords, this.pendingMedia);
      },
      // Ошибка
      () => {
        this.geoModal.show();
      },
    );
  }

  addPost(text, coords, media = null) {
    const post = new Post({
      text,
      coords,
      type: media ? media.type : 'text',
      mediaUrl: media ? media.url : null,
    });

    this.posts.unshift(post);
    this.renderPosts();
  }

  renderPosts() {
    this.postsEl.innerHTML = '';

    for (const post of this.posts) {
      const postEl = document.createElement('div');
      postEl.classList.add('post');

      if (post.type === 'text') {
        const textEl = document.createElement('div');
        textEl.classList.add('post__text');
        textEl.textContent = post.text;
        postEl.append(textEl);
      }

      if (post.type === 'audio') {
        const audioEl = document.createElement('audio');
        audioEl.classList.add('post__audio');
        audioEl.controls = true;
        audioEl.src = post.mediaUrl;
        postEl.append(audioEl);
      }
      if (post.type === 'video') {
        const videoEl = document.createElement('video');
        videoEl.classList.add('post__video');
        videoEl.controls = true;
        videoEl.src = post.mediaUrl;
        postEl.append(videoEl);
      }

      const coordsEl = document.createElement('div');
      coordsEl.classList.add('post__coords');
      coordsEl.textContent = `[${post.coords.latitude.toFixed(5)}, ${post.coords.longitude.toFixed(5)}]`;

      postEl.append(coordsEl);
      this.postsEl.append(postEl);
    }
  }
}
