/* eslint-disable no-underscore-dangle */
const glo = (global as unknown) as MicroFrontendGlobal;
const mfInfoKey = '_mfInfo';

export const getMicroFrontendInfo = () => glo[mfInfoKey];

export const isLoadedAsMicroFrontend = (name: string) =>
  name === glo[mfInfoKey]?.name;

export const removeMicroFrontendInfo = (name?: string) => {
  if (!name || glo[mfInfoKey]?.name === name) {
    glo[mfInfoKey] = undefined;
    document.cookie = `${mfInfoKey}=; path=/`;
  }
};

export const setMicroFrontendInfo = (name: string, host: string) => {
  const info: MicroFrontendInfo = { host, name };
  glo[mfInfoKey] = info;
  document.cookie = `${mfInfoKey}=${JSON.stringify(info)}; path=/`;
};

interface MicroFrontendGlobal
  extends Record<typeof mfInfoKey, MicroFrontendInfo | undefined | null> {}

interface MicroFrontendInfo {
  host: string;
  name: string;
}
