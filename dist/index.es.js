import React, { useEffect, memo, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

const generateContainerId = (name) => `${name}Container`;
const joinUrlPaths = (...paths) => paths
    .map(path => { var _a, _b; return (_b = (_a = path.match(/\/?(.+)\/?/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : ''; })
    .filter(Boolean)
    .join('/');

const getRegistries = () => {
    const win = window;
    win._mfRegistries =
        win._mfRegistries || new Map();
    return win._mfRegistries;
};

const renderMicroFrontend = ({ history, name, }) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.render(history); };
const unmountMicroFrontend = ({ name }) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.unmount(); };
const useMicroFrontend = ({ history, name, }) => useEffect(() => {
    renderMicroFrontend({ history, name });
    return () => unmountMicroFrontend({ name });
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
const getManifestUrl = (host) => `${host}/asset-manifest.json`;
const fetchManifest = async (host) => {
    const res = await fetch(getManifestUrl(host));
    return res.json();
};
const fetchScripts = (manifest, host, scriptId) => new Promise(resolve => {
    let count = 0;
    manifest.entrypoints.forEach(entryPoint => {
        const script = document.createElement('script');
        script.src = joinUrlPaths(host, entryPoint);
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

const renderApp = (container, App, history, isMicroFrontend) => {
    ReactDOM.render(React.createElement(App, { history: history, isMicroFrontend: isMicroFrontend }), container);
};
const registerApp = (name, container, App, callback) => {
    const registries = getRegistries();
    if (registries.has(name) && process.env.NODE_ENV !== 'production') {
        console.warn(`Register Micro Frontend with the same name '${name}'. It's probable a mistake.`);
    }
    registries.set(name, {
        render: history => {
            renderApp(container, App, history, true);
            callback === null || callback === void 0 ? void 0 : callback();
        },
        unmount: () => {
            ReactDOM.unmountComponentAtNode(container);
        },
    });
};
const bootstrapMicroFrontend = (name, App, callback) => {
    const containerId = generateContainerId(name);
    const container = document.getElementById(containerId);
    if (container) {
        registerApp(name, container, App, callback);
    }
    else {
        renderApp(document.getElementById('root'), App, createBrowserHistory(), false);
    }
};

export { MicroFrontend, MicroFrontendRoute, MicroFrontendRoutes, bootstrapMicroFrontend, lazyLoadMicroFrontend };
