export default class Post {
  constructor({ text = '', coords, type = 'text', mediaUrl = null }) {
    this.text = text;
    this.coords = coords;
    this.type = type;
    this.mediaUrl = mediaUrl;
    this.created = Date.now();
  }
}
