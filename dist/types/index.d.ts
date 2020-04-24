import { History } from 'history';
import { RouteProps } from 'react-router';
export interface MicroFrontendAppProps {
    history: History;
    isMicroFrontend: boolean;
}
export interface MicroFrontendRouteProps extends OmitFrom<RouteProps, 'render'> {
    host: string;
    microFrontendName: string;
    path: string;
}
export declare type OmitFrom<T, TKey extends keyof T> = Omit<T, TKey>;
