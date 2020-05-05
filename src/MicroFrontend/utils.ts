import { useEffect } from 'react';
import { History } from 'history';
import getRegistries from '../getRegistries';
import {
  removeMicroFrontendInfo,
  setMicroFrontendInfo,
} from '../microFrontendLoader';
import { MicroFrontendProps } from '../types';

const renderMicroFrontend = (
  name: string,
  history: History,
  microFrontendPath: string,
) => getRegistries().get(name)?.render(history, microFrontendPath);

const unmountMicroFrontend = ({ name }: { name: string }) =>
  getRegistries().get(name)?.unmount();

export const useMicroFrontend = ({
  history,
  host,
  name,
  path,
}: MicroFrontendProps) =>
  useEffect(() => {
    setMicroFrontendInfo(name, host);
    renderMicroFrontend(name, history, path);

    return () => {
      unmountMicroFrontend({ name });
      removeMicroFrontendInfo(name);
    };
  }, [history, host, name, path]);
