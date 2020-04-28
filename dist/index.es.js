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

var f="_mfInfo";

/* eslint-disable no-underscore-dangle */
const win = window;
const isLoadedAsMicroFrontend = (name) => { var _a; return name === ((_a = win[f]) === null || _a === void 0 ? void 0 : _a.name); };
const removeMicroFrontendInfo = (name) => {
    var _a;
    if (!name || ((_a = win[f]) === null || _a === void 0 ? void 0 : _a.name) === name) {
        win[f] = undefined;
        document.cookie = `${f}=; Max-Age=-99999999;`;
    }
};
const setMicroFrontendInfo = (name, host) => {
    const info = { host, name };
    win[f] = info;
    const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${f}=${JSON.stringify(info)}; expires=${expires.toUTCString()}; path=/`;
};

const renderMicroFrontend = (name, history, microFrontendPath) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.render(history, microFrontendPath); };
const unmountMicroFrontend = ({ name }) => { var _a; return (_a = getRegistries().get(name)) === null || _a === void 0 ? void 0 : _a.unmount(); };
const useMicroFrontend = ({ history, host, name, path, }) => useEffect(() => {
    setMicroFrontendInfo(name, host);
    renderMicroFrontend(name, history, path);
    return () => {
        unmountMicroFrontend({ name });
        removeMicroFrontendInfo(name);
    };
}, [history, host, name, path]);

const MicroFrontendComponent = ({ history, host, name, path, }) => {
    useMicroFrontend({ history, host, name, path });
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
const loadScripts = (manifest, host, scriptId) => new Promise((resolve, reject) => {
    let count = 0;
    const mainJsUrl = resolveUrl(host, manifest.files['main.js']);
    const scriptEntries = manifest.entrypoints.filter(entry => entry.endsWith('.js'));
    scriptEntries.forEach(entry => {
        const entryUrl = resolveUrl(host, entry);
        const script = document.createElement('script');
        script.src = entryUrl;
        script.async = true;
        if (entryUrl === mainJsUrl)
            script.id = scriptId;
        script.onload = () => {
            count += 1;
            if (count === scriptEntries.length)
                resolve();
        };
        script.onerror = (_e, _src, _lineNo, _colNo, err) => reject(err);
        document.head.appendChild(script);
    });
});
const loadStyles = (manifest, host) => {
    const styleEntries = manifest.entrypoints.filter(entry => entry.endsWith('.css'));
    styleEntries.forEach(entry => {
        const entryUrl = resolveUrl(host, entry);
        const link = document.createElement('link');
        link.href = entryUrl;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
    });
};
const lazyLoadMicroFrontend = ({ host, microFrontendName, path, }) => lazy(async () => {
    setMicroFrontendInfo(microFrontendName, host);
    const scriptId = generateScriptId(microFrontendName);
    if (!document.getElementById(scriptId)) {
        const manifest = await fetchManifest(host);
        await loadScripts(manifest, host, scriptId);
        loadStyles(manifest, host);
    }
    const Component = ({ history }) => (React.createElement(MicroFrontend, { history: history, host: host, name: microFrontendName, path: path }));
    return { default: Component };
});

const MicroFrontendRouteComponent = (_a) => {
    var { host, microFrontendName, path } = _a, props = __rest(_a, ["host", "microFrontendName", "path"]);
    return (React.createElement(Route, Object.assign({}, props, { component: lazyLoadMicroFrontend({
            host,
            microFrontendName,
            path,
        }), path: path })));
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

/* eslint-disable global-require */
const renderApp = (containerId, App, history, microFrontendPath, isMicroFrontend) => {
    ReactDOM.render(React.createElement(App, { history: history, isMicroFrontend: isMicroFrontend, microFrontendPath: microFrontendPath }), document.getElementById(containerId));
};
const registerApp = (name, App, callback) => {
    const registries = getRegistries();
    if (registries.has(name) && process.env.NODE_ENV !== 'production') {
        console.warn(`Register Micro Frontend with the same name '${name}'. It's probable a mistake.`);
    }
    registries.set(name, {
        render: (history, microFrontendPath) => {
            renderApp(generateContainerId(name), App, history, microFrontendPath, true);
            callback === null || callback === void 0 ? void 0 : callback();
        },
        unmount: () => {
            ReactDOM.unmountComponentAtNode(document.getElementById(generateContainerId(name)));
        },
    });
};
const bootstrapMicroFrontend = (microFrontendName, App, callback, rootId = 'root') => {
    if (isLoadedAsMicroFrontend(microFrontendName)) {
        registerApp(microFrontendName, App, callback);
    }
    else {
        renderApp(rootId, App, createBrowserHistory(), '', false);
    }
};

export { MicroFrontend, MicroFrontendRoute, MicroFrontendRoutes, bootstrapContainer, bootstrapMicroFrontend, lazyLoadMicroFrontend };
