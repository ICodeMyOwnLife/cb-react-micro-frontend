import { History } from 'history';

const MF_REGISTRIES_KEY = '_mfRegistries';

const getRegistries = () => {
  const win = (window as unknown) as MicroFrontendWindow;
  win[MF_REGISTRIES_KEY] =
    win[MF_REGISTRIES_KEY] || new Map<string, MicroFrontendRegistry>();
  return win[MF_REGISTRIES_KEY];
};

export default getRegistries;

interface MicroFrontendWindow extends Window {
  [MF_REGISTRIES_KEY]: Map<string, MicroFrontendRegistry>;
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
