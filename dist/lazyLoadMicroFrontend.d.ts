import React from 'react';
declare const lazyLoadMicroFrontend: ({ host, microFrontendName, path, }: {
    host: string;
    microFrontendName: string;
    path: string;
}) => React.LazyExoticComponent<React.FC<{}>>;
export default lazyLoadMicroFrontend;
