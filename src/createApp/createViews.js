import { getViews } from './components/ViewProvider';
import defaultViewFactory from './defaultViews';

export default viewFactory => getViews(defaultViewFactory, viewFactory);
