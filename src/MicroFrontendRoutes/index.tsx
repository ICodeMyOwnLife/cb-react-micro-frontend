import React, { FC, memo } from 'react';
import { Switch } from 'react-router';
import MicroFrontendRoute from '../MicroFrontendRoute';
import { MicroFrontendRouteProps } from '../types';

export const MicroFrontendRoutesComponent: FC<MicroFrontendRoutesProps> = ({
  routeProps,
}) => (
  <Switch>
    {routeProps.map(props => (
      <MicroFrontendRoute {...props} key={props.microFrontendName} />
    ))}
  </Switch>
);

const MicroFrontendRoutes = memo(MicroFrontendRoutesComponent);
MicroFrontendRoutes.displayName = 'MicroFrontendRoutes';
export default MicroFrontendRoutes;

export interface MicroFrontendRoutesProps {
  routeProps: MicroFrontendRouteProps[];
}
