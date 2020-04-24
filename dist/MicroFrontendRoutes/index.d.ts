import React, { FC, SuspenseProps } from 'react';
import { MicroFrontendRouteProps } from '../types';
export declare const MicroFrontendRoutesComponent: FC<MicroFrontendRoutesProps>;
declare const MicroFrontendRoutes: React.NamedExoticComponent<MicroFrontendRoutesProps>;
export default MicroFrontendRoutes;
export interface MicroFrontendRoutesProps {
    fallback: SuspenseProps['fallback'];
    routeProps: MicroFrontendRouteProps[];
}
