import React, { FC } from 'react';
import { History } from 'history';
export declare const MicroFrontendComponent: FC<MicroFrontendProps>;
declare const MicroFrontend: React.NamedExoticComponent<MicroFrontendProps>;
export default MicroFrontend;
export interface MicroFrontendProps {
    history: History;
    host: string;
    name: string;
}
