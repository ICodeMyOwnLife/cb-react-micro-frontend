import React, { FC, memo } from 'react';
import { Route } from 'react-router-dom';
import lazyLoadMicroFrontend from '../lazyLoadMicroFrontend';
import { MicroFrontendRouteProps } from '../types';

export const MicroFrontendRouteComponent: FC<MicroFrontendRouteProps> = ({
  host,
  microFrontendName,
  path,
  ...props
}) => (
  <Route
    {...props}
    component={lazyLoadMicroFrontend({
      host,
      microFrontendName,
      path,
    })}
    path={path}
  />
);

const MicroFrontendRoute = memo(MicroFrontendRouteComponent);
MicroFrontendRoute.displayName = 'MicroFrontendRoute';
export default MicroFrontendRoute;
