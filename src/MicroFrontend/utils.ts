import { useEffect } from 'react';
import { History } from 'history';
import getRegistries from '../getRegistries';
import {
  removeMicroFrontendInfo,
  setMicroFrontendInfo,
} from '../microFrontendLoader';

const renderMicroFrontend = ({
  history,
  name,
}: {
  history: History;
  name: string;
}) => getRegistries().get(name)?.render(history);

const unmountMicroFrontend = ({ name }: { name: string }) =>
  getRegistries().get(name)?.unmount();

export const useMicroFrontend = ({
  history,
  host,
  name,
}: {
  history: History;
  host: string;
  name: string;
}) =>
  useEffect(() => {
    setMicroFrontendInfo(name, host);
    renderMicroFrontend({ history, name });
    return () => {
      unmountMicroFrontend({ name });
      removeMicroFrontendInfo(name);
    };
  }, [history, host, name]);
