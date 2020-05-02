/* eslint-disable no-underscore-dangle */
const win = (window as unknown) as MicroFrontendGlobal;
const mfInfoKey = '_mfInfo';

export const getMicroFrontendInfo = () => win[mfInfoKey];

export const isLoadedAsMicroFrontend = (name: string) =>
  name === win[mfInfoKey]?.name;

export const removeMicroFrontendInfo = (name?: string) => {
  if (!name || win[mfInfoKey]?.name === name) {
    win[mfInfoKey] = undefined;
    document.cookie = `${mfInfoKey}=; Max-Age=-99999999;`;
  }
};

export const setMicroFrontendInfo = (name: string, host: string) => {
  const info: MicroFrontendInfo = { host, name };
  win[mfInfoKey] = info;
  const infoText = JSON.stringify(info);
  const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
  const expiresText = expires.toUTCString();
  document.cookie = `${mfInfoKey}=${infoText}; expires=${expiresText}; samesite=strict; path=/`;
};

interface MicroFrontendGlobal
  extends Record<typeof mfInfoKey, MicroFrontendInfo | undefined | null> {}

interface MicroFrontendInfo {
  host: string;
  name: string;
}
