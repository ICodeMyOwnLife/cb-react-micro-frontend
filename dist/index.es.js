import React, { useEffect, memo, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

const generateContainerId = (name) => `${name}Container`;

const getRegistries = () => {
    const win = window;
    win._mfRegistries =
        win._mfRegistries || new Map();
    return win._mfRegistries;
};

/* eslint-disable no-underscore-dangle */
const glo = global;
const mfInfoKey = '_mfInfo';
const isLoadedAsMicroFrontend = (name) => { var _a; return name === ((_a = glo[mfInfoKey]) === null || _a === void 0 ? void 0 : _a.name); };
const removeMicroFrontendInfo = (name) => {
    var _a;
    if (!name || ((_a = glo[mfInfoKey]) === null || _a === void 0 ? void 0 : _a.name) === name) {
        glo[mfInfoKey] = undefined;
        document.cookie = `${mfInfoKey}=; path=/`;
    }
};

const renderMicroFrontend = ({ history, name, }) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.render(history); };
const unmountMicroFrontend = ({ name }) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.unmount(); };
const useMicroFrontend = ({ history, name, }) => useEffect(() => {
    renderMicroFrontend({ history, name });
    return () => {
        unmountMicroFrontend({ name });
        removeMicroFrontendInfo(name);
    };
}, [history, name]);

const MicroFrontendComponent = ({ history, name, }) => {
    useMicroFrontend({ history, name });
    return React.createElement("main", { id: generateContainerId(name) });
};
const MicroFrontend = memo(MicroFrontendComponent);
MicroFrontend.displayName = 'MicroFrontend';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const generateScriptId = (name) => `_mfScript${name}`;
const resolveUrl = (host, path) => new URL(path, host).toString();
const fetchManifest = async (host) => {
    const res = await fetch(resolveUrl(host, '/asset-manifest.json'));
    return res.json();
};
const fetchScripts = (manifest, host, scriptId) => new Promise(resolve => {
    let count = 0;
    manifest.entrypoints
        .filter(entryPoint => entryPoint.endsWith('.js'))
        .forEach(entryPoint => {
        const script = document.createElement('script');
        script.src = resolveUrl(host, entryPoint);
        if (entryPoint === manifest.files['main.js'])
            script.id = scriptId;
        script.onload = () => {
            count += 1;
            if (count === manifest.entrypoints.length)
                resolve();
        };
        document.head.appendChild(script);
    });
});
const lazyLoadMicroFrontend = ({ host, microFrontendName, }) => lazy(async () => {
    const scriptId = generateScriptId(microFrontendName);
    if (!document.getElementById(scriptId)) {
        const manifest = await fetchManifest(host);
        await fetchScripts(manifest, host, scriptId);
    }
    const Component = ({ history }) => (React.createElement(MicroFrontend, { history: history, name: microFrontendName }));
    return { default: Component };
});

const MicroFrontendRouteComponent = (_a) => {
    var { host, microFrontendName } = _a, props = __rest(_a, ["host", "microFrontendName"]);
    return (React.createElement(Route, Object.assign({}, props, { component: lazyLoadMicroFrontend({ host, microFrontendName }) })));
};
const MicroFrontendRoute = memo(MicroFrontendRouteComponent);
MicroFrontendRoute.displayName = 'MicroFrontendRoute';

const MicroFrontendRoutesComponent = ({ fallback, routeProps, }) => (React.createElement(Switch, null,
    React.createElement(Suspense, { fallback: fallback }, routeProps.map(props => (React.createElement(MicroFrontendRoute, Object.assign({}, props, { key: props.microFrontendName })))))));
const MicroFrontendRoutes = memo(MicroFrontendRoutesComponent);
MicroFrontendRoutes.displayName = 'MicroFrontendRoutes';

const bootstrapContainer = () => {
    removeMicroFrontendInfo();
};

const renderApp = (containerId, App, history, isMicroFrontend) => {
    ReactDOM.render(React.createElement(App, { history: history, isMicroFrontend: isMicroFrontend }), document.getElementById(containerId));
};
const registerApp = (name, App, callback) => {
    const registries = getRegistries();
    if (registries.has(name) && process.env.NODE_ENV !== 'production') {
        console.warn(`Register Micro Frontend with the same name '${name}'. It's probable a mistake.`);
    }
    registries.set(name, {
        render: history => {
            renderApp(generateContainerId(name), App, history, true);
            callback === null || callback === void 0 ? void 0 : callback();
        },
        unmount: () => {
            ReactDOM.unmountComponentAtNode(document.getElementById(generateContainerId(name)));
        },
    });
};
const bootstrapMicroFrontend = (name, App, callback, rootId = 'root') => {
    if (isLoadedAsMicroFrontend(name)) {
        registerApp(name, App, callback);
    }
    else {
        renderApp(rootId, App, createBrowserHistory(), false);
    }
};

export { MicroFrontend, MicroFrontendRoute, MicroFrontendRoutes, bootstrapContainer, bootstrapMicroFrontend, lazyLoadMicroFrontend };
