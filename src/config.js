import routes from './routes';
import rootReducer from './reducers';
import rootSaga from './sagas';
import { apiHandler, reactRender, pageRender } from './ssr/helper';
import isFunction from 'lodash/isFunction';

import App from './containers/App.jsx';

const appName = 'IFCityEvent';

export const appData = {
    routes,
    rootReducer,
    rootSaga,
    App
};

const pageConfig = {
    appName,
    getPageTitle: (route, data, match) => {
        return `${route ? (isFunction(route.pageTitle) ? route.pageTitle(data, match) : route.pageTitle) : appName}`
    },
    appData
};

const reactConfig = {
    next: pageRender(pageConfig),
    appData
};

const apiConfig = {
    next: reactRender(reactConfig),
    appData
};

export const appConfig = {
    next: apiHandler(apiConfig),
    appData
};
