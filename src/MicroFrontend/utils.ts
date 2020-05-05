import { useEffect } from 'react';
import getRegistries from '../getRegistries';
import {
  removeMicroFrontendInfo,
  setMicroFrontendInfo,
} from '../microFrontendLoader';
import { MicroFrontendProps } from '../types';

const renderMicroFrontend = (name: string, microFrontendPath: string) =>
  getRegistries().get(name)?.render(microFrontendPath);

const unmountMicroFrontend = ({ name }: { name: string }) =>
  getRegistries().get(name)?.unmount();

export const useMicroFrontend = ({ host, name, path }: MicroFrontendProps) =>
  useEffect(() => {
    setMicroFrontendInfo(name, host);
    renderMicroFrontend(name, path);
    return () => {
      unmountMicroFrontend({ name });
      removeMicroFrontendInfo(name);
    };
  }, [host, name, path]);
