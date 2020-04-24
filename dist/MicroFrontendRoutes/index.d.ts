import React, { FC } from 'react';
import { MicroFrontendRouteProps } from '../types';
export declare const MicroFrontendRoutesComponent: FC<MicroFrontendRoutesProps>;
declare const MicroFrontendRoutes: React.NamedExoticComponent<MicroFrontendRoutesProps>;
export default MicroFrontendRoutes;
export interface MicroFrontendRoutesProps {
    routeProps: MicroFrontendRouteProps[];
}
