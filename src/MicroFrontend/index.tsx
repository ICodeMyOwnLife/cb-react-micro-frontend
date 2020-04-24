import React, { FC, memo } from 'react';
import { History } from 'history';
import { generateContainerId } from '../utils';
import { useMicroFrontend } from './utils';

export const MicroFrontendComponent: FC<MicroFrontendProps> = ({
  history,
  host,
  name,
}) => {
  useMicroFrontend({ history, host, name });
  return <main id={generateContainerId(name)} />;
};

const MicroFrontend = memo(MicroFrontendComponent);
MicroFrontend.displayName = 'MicroFrontend';
export default MicroFrontend;

export interface MicroFrontendProps {
  history: History;
  host: string;
  name: string;
}
