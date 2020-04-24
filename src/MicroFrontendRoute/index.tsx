import React, { FC, memo } from 'react';
import { Route } from 'react-router';
import MicroFrontend from '../MicroFrontend';
import { MicroFrontendRouteProps } from '../types';

export const MicroFrontendRouteComponent: FC<MicroFrontendRouteProps> = ({
  host,
  microFrontendName,
  ...props
}) => (
  <Route
    {...props}
    render={({ history }) => (
      <MicroFrontend history={history} host={host} name={microFrontendName} />
    )}
  />
);

const MicroFrontendRoute = memo(MicroFrontendRouteComponent);
MicroFrontendRoute.displayName = 'MicroFrontendRoute';
export default MicroFrontendRoute;
