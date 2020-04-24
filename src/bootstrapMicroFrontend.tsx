import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { History, createBrowserHistory } from 'history';
import getRegistries from './getRegistries';
import { generateContainerId } from './utils';
import { MicroFrontendAppProps } from './types';

const renderApp = (
  container: HTMLElement,
  App: ComponentType<MicroFrontendAppProps>,
  history: History,
  isMicroFrontend: boolean,
) => {
  ReactDOM.render(
    <App history={history} isMicroFrontend={isMicroFrontend} />,
    container,
  );
};

const registerApp = (
  name: string,
  container: HTMLElement,
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
    render: history => {
      renderApp(container, App, history, true);
      callback?.();
    },
    unmount: () => {
      ReactDOM.unmountComponentAtNode(container);
    },
  });
};

const bootstrapMicroFrontend = (
  name: string,
  App: ComponentType<MicroFrontendAppProps>,
  callback?: VoidFunction,
) => {
  const containerId = generateContainerId(name);
  const container = document.getElementById(containerId);

  if (container) {
    registerApp(name, container, App, callback);
  } else {
    renderApp(
      document.getElementById('root')!,
      App,
      createBrowserHistory(),
      false,
    );
  }
};

export default bootstrapMicroFrontend;
