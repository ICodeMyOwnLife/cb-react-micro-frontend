import { RouteProps } from 'react-router';
import { History } from 'history';

export interface MicroFrontendAppProps {
  history: History;
  isMicroFrontend: boolean;
}

export interface MicroFrontendProps {
  history: History;
  name: string;
}

export interface MicroFrontendRouteProps
  extends OmitFrom<RouteProps, 'render'>,
    OmitFrom<MicroFrontendProps, 'history' | 'name'> {
  host: string;
  microFrontendName: string;
  path: string;
}

export type OmitFrom<T, TKey extends keyof T> = Omit<T, TKey>;
