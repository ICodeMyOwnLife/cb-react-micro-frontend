import React, { FC, memo } from 'react';
import { Route } from 'react-router';
import { MicroFrontendRouteProps } from '../types';
import lazyLoadMicroFrontend from '../lazyLoadMicroFrontend';

export const MicroFrontendRouteComponent: FC<MicroFrontendRouteProps> = ({
  host,
  microFrontendName,
  ...props
}) => (
  <Route
    {...props}
    component={lazyLoadMicroFrontend({ host, microFrontendName })}
  />
);

const MicroFrontendRoute = memo(MicroFrontendRouteComponent);
MicroFrontendRoute.displayName = 'MicroFrontendRoute';
export default MicroFrontendRoute;
