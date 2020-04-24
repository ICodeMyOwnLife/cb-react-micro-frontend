import React, { FC, memo, Suspense, SuspenseProps } from 'react';
import { Switch } from 'react-router';
import MicroFrontendRoute from '../MicroFrontendRoute';
import { MicroFrontendRouteProps } from '../types';

export const MicroFrontendRoutesComponent: FC<MicroFrontendRoutesProps> = ({
  fallback,
  routeProps,
}) => (
  <Switch>
    <Suspense fallback={fallback}>
      {routeProps.map(props => (
        <MicroFrontendRoute {...props} key={props.microFrontendName} />
      ))}
    </Suspense>
  </Switch>
);

const MicroFrontendRoutes = memo(MicroFrontendRoutesComponent);
MicroFrontendRoutes.displayName = 'MicroFrontendRoutes';
export default MicroFrontendRoutes;

export interface MicroFrontendRoutesProps {
  fallback: SuspenseProps['fallback'];
  routeProps: MicroFrontendRouteProps[];
}
