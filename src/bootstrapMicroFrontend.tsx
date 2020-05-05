import React, { ComponentType } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import MicroFrontendWrapper from './MicroFrontendWrapper';
import getRegistries from './getRegistries';
import { generateContainerId } from './utils';
import { MicroFrontendAppProps } from './types';
import { isLoadedAsMicroFrontend } from './microFrontendLoader';

const renderApp = (
  containerId: string,
  App: ComponentType<MicroFrontendAppProps>,
  microFrontendPath: string,
  isMicroFrontend: boolean,
) => {
  const Wrapper = isMicroFrontend ? MicroFrontendWrapper : BrowserRouter;
  ReactDOM.render(
    <Wrapper>
      <App
        isMicroFrontend={isMicroFrontend}
        microFrontendPath={microFrontendPath}
      />
    </Wrapper>,
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
    render: microFrontendPath => {
      renderApp(generateContainerId(name), App, microFrontendPath, true);
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
    renderApp(rootId, App, '', false);
  }
};

export default bootstrapMicroFrontend;
