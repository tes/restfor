import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { routerMiddleware } from 'react-router-redux';

export default extraArguments =>
  createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(extraArguments.history), thunk.withExtraArgument(extraArguments))
    )
  );
