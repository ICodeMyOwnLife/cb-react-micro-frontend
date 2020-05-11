import React, { useEffect, memo, lazy, Suspense } from 'react';
import { Route, Switch, BrowserRouter, Router } from 'react-router-dom';
import ReactDOM from 'react-dom';

const generateContainerId = (name) => `${name}Container`;

const MF_REGISTRIES_KEY = '_mfRegistries';
const getRegistries = () => {
    const win = window;
    win[MF_REGISTRIES_KEY] =
        win[MF_REGISTRIES_KEY] || new Map();
    return win[MF_REGISTRIES_KEY];
};

var _="_mfInfo";

const win = window;
const isLoadedAsMicroFrontend = (name) => { var _a; return name === ((_a = win[_]) === null || _a === void 0 ? void 0 : _a.name); };
const removeMicroFrontendInfo = (name) => {
    var _a;
    if (!name || ((_a = win[_]) === null || _a === void 0 ? void 0 : _a.name) === name) {
        win[_] = undefined;
    }
};
const setMicroFrontendInfo = (name, host) => {
    const info = { host, name };
    win[_] = info;
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
        script.crossOrigin = '';
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

const bootstrapContainer = (App, rootId = 'root') => {
    ReactDOM.render(React.createElement(BrowserRouter, null,
        React.createElement(App, null)), document.getElementById(rootId));
};

const setPublicPath = () => {
    __webpack_public_path__ = process.env.REACT_APP_PUBLIC_PATH;
};

const renderRoot = (rootId, root) => {
    ReactDOM.render(root, document.getElementById(rootId));
};
const registerApp = (name, App, callback) => {
    const registries = getRegistries();
    if (registries.has(name) && process.env.NODE_ENV !== 'production') {
        console.warn(`Register Micro Frontend with the same name '${name}'. It's probable a mistake.`);
    }
    registries.set(name, {
        render: (history, microFrontendPath) => {
            renderRoot(generateContainerId(name), React.createElement(Router, { history: history },
                React.createElement(App, { isMicroFrontend: true, microFrontendPath: microFrontendPath })));
            callback === null || callback === void 0 ? void 0 : callback();
        },
        unmount: () => {
            ReactDOM.unmountComponentAtNode(document.getElementById(generateContainerId(name)));
        },
    });
};
const bootstrapMicroFrontend = (microFrontendName, App, callback, rootId = 'root') => {
    if (isLoadedAsMicroFrontend(microFrontendName)) {
        setPublicPath();
        registerApp(microFrontendName, App, callback);
    }
    else {
        renderRoot(rootId, React.createElement(BrowserRouter, null,
            React.createElement(App, { isMicroFrontend: false, microFrontendPath: "" })));
    }
};

export { MicroFrontend, MicroFrontendRoute, MicroFrontendRoutes, bootstrapContainer, bootstrapMicroFrontend };
