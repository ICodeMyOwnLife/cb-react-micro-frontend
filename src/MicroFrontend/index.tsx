import React, { FC, memo } from 'react';
import { generateContainerId } from '../utils';
import { MicroFrontendProps } from '../types';
import { useMicroFrontend } from './utils';

export const MicroFrontendComponent: FC<MicroFrontendProps> = ({
  host,
  name,
  path,
}) => {
  useMicroFrontend({ host, name, path });
  return <main id={generateContainerId(name)} />;
};

const MicroFrontend = memo(MicroFrontendComponent);
MicroFrontend.displayName = 'MicroFrontend';
export default MicroFrontend;
