import { useEffect } from 'react';
import { History } from 'history';
import getRegistries from '../getRegistries';

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
  name,
}: {
  history: History;
  name: string;
}) =>
  useEffect(() => {
    renderMicroFrontend({ history, name });
    return () => unmountMicroFrontend({ name });
  }, [history, name]);