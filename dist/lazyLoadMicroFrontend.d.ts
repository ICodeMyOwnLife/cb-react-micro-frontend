import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
declare const lazyLoadMicroFrontend: ({ host, microFrontendName, path, }: {
    host: string;
    microFrontendName: string;
    path: string;
}) => React.LazyExoticComponent<React.FC<RouteComponentProps<{}, import("react-router").StaticContext, import("history").History.PoorMansUnknown>>>;
export default lazyLoadMicroFrontend;
