import { RouteProps } from 'react-router';
import { History } from 'history';

export interface MicroFrontendAppProps {
  microFrontendPath: string;
  history: History;
  isMicroFrontend: boolean;
}

export interface MicroFrontendProps {
  history: History;
  host: string;
  name: string;
  path: string;
}

export interface MicroFrontendRouteProps
  extends OmitFrom<RouteProps, 'path' | 'render'>,
    OmitFrom<MicroFrontendProps, 'history' | 'name'> {
  microFrontendName: string;
}

export type OmitFrom<T, TKey extends keyof T> = Omit<T, TKey>;
