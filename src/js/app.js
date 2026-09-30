console.log('app started');

import Timeline from './Timeline';

const root = document.getElementById('root');
const app = new Timeline(root);

app.init();
