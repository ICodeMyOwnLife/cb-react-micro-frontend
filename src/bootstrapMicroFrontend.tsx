import React, { ComponentType, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Router, BrowserRouter } from 'react-router-dom';
import getRegistries from './getRegistries';
import { generateContainerId } from './utils';
import { MicroFrontendAppProps } from './types';
import { isLoadedAsMicroFrontend } from './microFrontendLoader';
import setPublicPath from './setPublicPath';

const renderRoot = (rootId: string, root: ReactElement) => {
  ReactDOM.render(root, document.getElementById(rootId));
};

const registerApp = (
  name: string,
  App: ComponentType<MicroFrontendAppProps>,
  callback?: VoidFunction,
) => {
  const registries = getRegistries();
  if (registries.has(name) && process.env.NODE_ENV !== 'production') {
    console.warn(
      `Register Micro Frontend with the same name '${name}'. It's probable a mistake.`,
    );
  }
  registries.set(name, {
    render: (history, microFrontendPath) => {
      renderRoot(
        generateContainerId(name),
        <Router history={history}>
          <App isMicroFrontend microFrontendPath={microFrontendPath} />
        </Router>,
      );
      callback?.();
    },
    unmount: () => {
      ReactDOM.unmountComponentAtNode(
        document.getElementById(generateContainerId(name))!,
      );
    },
  });
};

const bootstrapMicroFrontend = (
  microFrontendName: string,
  App: ComponentType<MicroFrontendAppProps>,
  callback?: VoidFunction,
  rootId = 'root',
) => {
  setPublicPath();
  if (isLoadedAsMicroFrontend(microFrontendName)) {
    registerApp(microFrontendName, App, callback);
  } else {
    renderRoot(
      rootId,
      <BrowserRouter>
        <App isMicroFrontend={false} microFrontendPath="" />
      </BrowserRouter>,
    );
  }
};

export default bootstrapMicroFrontend;
