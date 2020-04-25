/* eslint-disable no-underscore-dangle */
import { History } from 'history';

const getRegistries = () => {
  const win = (window as unknown) as MicroFrontendWindow;
  win._mfRegistries =
    win._mfRegistries || new Map<string, MicroFrontendRegistry>();
  return win._mfRegistries;
};

export default getRegistries;

interface MicroFrontendWindow extends Window {
  _mfRegistries: Map<string, MicroFrontendRegistry>;
}

interface MicroFrontendRegistry {
  render: RenderMicroFrontend;
  unmount: UnmountMicroFrontend;
}

interface RenderMicroFrontend {
  (history: History, microFrontendPath: string): void;
}

interface UnmountMicroFrontend {
  (): void;
}
