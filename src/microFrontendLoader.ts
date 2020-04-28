/* eslint-disable no-underscore-dangle */
import { MF_INFO_KEY } from 'cb-react-micro-frontend-core';

const win = (window as unknown) as MicroFrontendGlobal;

export const getMicroFrontendInfo = () => win[MF_INFO_KEY];

export const isLoadedAsMicroFrontend = (name: string) =>
  name === win[MF_INFO_KEY]?.name;

export const removeMicroFrontendInfo = (name?: string) => {
  if (!name || win[MF_INFO_KEY]?.name === name) {
    win[MF_INFO_KEY] = undefined;
    document.cookie = `${MF_INFO_KEY}=; Max-Age=-99999999;`;
  }
};

export const setMicroFrontendInfo = (name: string, host: string) => {
  const info: MicroFrontendInfo = { host, name };
  win[MF_INFO_KEY] = info;
  const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
  document.cookie = `${MF_INFO_KEY}=${JSON.stringify(
    info,
  )}; expires=${expires.toUTCString()}; path=/`;
};

interface MicroFrontendGlobal
  extends Record<typeof MF_INFO_KEY, MicroFrontendInfo | undefined | null> {}

interface MicroFrontendInfo {
  host: string;
  name: string;
}
