/* eslint-disable no-underscore-dangle */
const glo = (global as unknown) as MicroFrontendGlobal;
const mfInfoKey = '_mfInfo';

export const getMicroFrontendInfo = () => glo[mfInfoKey];

export const isLoadedAsMicroFrontend = (name: string) =>
  name === glo[mfInfoKey]?.name;

export const removeMicroFrontendInfo = (name?: string) => {
  if (!name || glo[mfInfoKey]?.name === name) {
    glo[mfInfoKey] = undefined;
    document.cookie = `${mfInfoKey}=; Max-Age=-99999999;`;
  }
};

export const setMicroFrontendInfo = (name: string, host: string) => {
  const info: MicroFrontendInfo = { host, name };
  glo[mfInfoKey] = info;
  const expires = new Date(Date.now() + 10 * 365 * 60 * 60 * 1000);
  document.cookie = `${mfInfoKey}=${JSON.stringify(
    info,
  )}; expires=${expires.toUTCString()}; path=/`;
};

interface MicroFrontendGlobal
  extends Record<typeof mfInfoKey, MicroFrontendInfo | undefined | null> {}

interface MicroFrontendInfo {
  host: string;
  name: string;
}
