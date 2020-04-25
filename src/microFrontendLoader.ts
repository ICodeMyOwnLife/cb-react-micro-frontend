/* eslint-disable no-underscore-dangle */
const win = (window as unknown) as MicroFrontendWindow;

export const getMicroFrontendName = () => win._mfName;

export const isLoadedAsMicroFrontend = (name: string) => name === win._mfName;

export const setMicroFrontendName = (name: string) => {
  win._mfName = name;
};

interface MicroFrontendWindow extends Window {
  _mfName: string | null | undefined;
}
