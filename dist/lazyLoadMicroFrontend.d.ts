import React from 'react';
import { History } from 'history';
declare const lazyLoadMicroFrontend: ({ host, microFrontendName, }: {
    host: string;
    microFrontendName: string;
}) => React.LazyExoticComponent<React.FC<{
    history: History<History.PoorMansUnknown>;
}>>;
export default lazyLoadMicroFrontend;