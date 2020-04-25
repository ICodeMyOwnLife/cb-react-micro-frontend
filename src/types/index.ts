import { RouteProps } from 'react-router';
import { History } from 'history';

export interface MicroFrontendAppProps {
  history: History;
  isMicroFrontend: boolean;
}

export interface MicroFrontendProps {
  history: History;
  host: string;
  name: string;
}

export interface MicroFrontendRouteProps
  extends OmitFrom<RouteProps, 'render'>,
    OmitFrom<MicroFrontendProps, 'history' | 'name'> {
  microFrontendName: string;
  path: string;
}

export type OmitFrom<T, TKey extends keyof T> = Omit<T, TKey>;
