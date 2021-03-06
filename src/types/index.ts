import { RouteProps } from 'react-router-dom';
import { History } from 'history';
import { OmitFrom } from 'cb-toolset/object';

export interface MicroFrontendAppProps {
  microFrontendPath: string;
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
