/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { History, createBrowserHistory } from 'history';
import getRegistries from './getRegistries';
import { generateContainerId } from './utils';
import { MicroFrontendAppProps } from './types';
import { isLoadedAsMicroFrontend } from './microFrontendLoader';

const renderApp = (
  containerId: string,
  App: ComponentType<MicroFrontendAppProps>,
  history: History,
  microFrontendPath: string,
  isMicroFrontend: boolean,
) => {
  ReactDOM.render(
    <App
      history={history}
      isMicroFrontend={isMicroFrontend}
      microFrontendPath={microFrontendPath}
    />,
    document.getElementById(containerId),
  );
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
      renderApp(
        generateContainerId(name),
        App,
        history,
        microFrontendPath,
        true,
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
  if (isLoadedAsMicroFrontend(microFrontendName)) {
    registerApp(microFrontendName, App, callback);
  } else {
    renderApp(rootId, App, createBrowserHistory(), '', false);
  }
};

export default bootstrapMicroFrontend;
