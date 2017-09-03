import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectMountNodeIfNeeded from './factories/injectMountNodeIfNeeded';
import registerServiceWorker from './factories/registerServiceWorker';
import setupClipboard from './factories/setupClipboard';
import Root from './Root';

function render(Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    injectMountNodeIfNeeded(),
  );
}

render(Root);

if ((module as any).hot) {
  (module as any).hot.accept('./Root', () => {
    render(Root);
  });
}

setupClipboard();

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
