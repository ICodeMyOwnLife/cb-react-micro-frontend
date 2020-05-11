import React, { FC, memo, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const MicroFrontendContainerComponent: FC<MicroFrontendContainerProps> = ({
  children,
}) => <BrowserRouter>{children}</BrowserRouter>;

const MicroFrontendContainer = memo(MicroFrontendContainerComponent);
MicroFrontendContainer.displayName = 'MicroFrontendContainer';
export default MicroFrontendContainer;

export interface MicroFrontendContainerProps {
  children?: ReactNode;
}
