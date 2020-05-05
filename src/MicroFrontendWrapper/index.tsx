import React, { FC, memo, ReactNode } from 'react';
import { Router, useHistory } from 'react-router-dom';

export const MicroFrontendWrapperComponent: FC<MicroFrontendWrapperProps> = ({
  children,
}) => {
  const history = useHistory();
  return <Router history={history}>{children}</Router>;
};

const MicroFrontendWrapper = memo(MicroFrontendWrapperComponent);
MicroFrontendWrapper.displayName = 'MicroFrontendWrapper';
export default MicroFrontendWrapper;

export interface MicroFrontendWrapperProps {
  children?: ReactNode;
}
