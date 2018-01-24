import ReactDOM from 'react-dom';
import createApp from './createApp';
import viewFactory from './views';

ReactDOM.render(
  createApp(
    { apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'http://35.156.223.46/api' },
    viewFactory
  ),
  document.getElementById('root')
);
