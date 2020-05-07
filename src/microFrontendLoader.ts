import { MF_INFO_KEY } from 'cb-react-micro-frontend-core';

const win = (window as unknown) as MicroFrontendGlobal;

export const getMicroFrontendInfo = () => win[MF_INFO_KEY];

export const isLoadedAsMicroFrontend = (name: string) =>
  name === win[MF_INFO_KEY]?.name;

export const removeMicroFrontendInfo = (name?: string) => {
  if (!name || win[MF_INFO_KEY]?.name === name) {
    win[MF_INFO_KEY] = undefined;
  }
};

export const setMicroFrontendInfo = (name: string, host: string) => {
  const info: MicroFrontendInfo = { host, name };
  win[MF_INFO_KEY] = info;
};

interface MicroFrontendGlobal {
  [MF_INFO_KEY]: MicroFrontendInfo | undefined;
}

interface MicroFrontendInfo {
  host: string;
  name: string;
}
