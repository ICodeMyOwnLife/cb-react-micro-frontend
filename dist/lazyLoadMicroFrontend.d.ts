import React from 'react';
import { History } from 'history';
declare const lazyLoadMicroFrontend: ({ host, microFrontendName, path, }: {
    host: string;
    microFrontendName: string;
    path: string;
}) => React.LazyExoticComponent<React.FC<{
    history: History<History.PoorMansUnknown>;
}>>;
export default lazyLoadMicroFrontend;
