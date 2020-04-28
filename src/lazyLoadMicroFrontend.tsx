import React, { lazy, FC } from 'react';
import { History } from 'history';
import MicroFrontend from './MicroFrontend';
import { setMicroFrontendInfo } from './microFrontendLoader';

const generateScriptId = (name: string) => `_mfScript${name}`;

const resolveUrl = (host: string, path: string) =>
  new URL(path, host).toString();

const fetchManifest = async (host: string) => {
  const res = await fetch(resolveUrl(host, '/asset-manifest.json'));
  return res.json() as Promise<Manifest>;
};

const loadScriptEntry = (
  src: string,
  id: string | undefined | false,
  handleLoad: VoidFunction,
  handleError: OnErrorEventHandlerNonNull,
) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (id) script.id = id;
  script.onload = handleLoad;
  script.onerror = handleError;
  document.head.appendChild(script);
};

const loadStyleEntry = (href: string, handleDone: VoidFunction) => {
  const link = document.createElement('link');
  link.href = href;
  link.rel = 'text/css';
  link.onload = handleDone;
  link.onerror = handleDone;
  document.head.appendChild(link);
};

const loadEntryPoints = (manifest: Manifest, host: string, scriptId: string) =>
  new Promise<void>((resolve, reject) => {
    let count = 0;
    const mainJsUrl = resolveUrl(host, manifest.files['main.js']);
    const scriptEntries = manifest.entrypoints.filter(entry =>
      entry.endsWith('.js'),
    );
    const styleEntries = manifest.entrypoints.filter(entry =>
      entry.endsWith('.css'),
    );
    const handleLoad = () => {
      count += 1;
      if (count === scriptEntries.length + styleEntries.length) resolve();
    };
    const handleError: OnErrorEventHandlerNonNull = (
      _e,
      _src,
      _lineNo,
      _colNo,
      err,
    ) => reject(err);
    scriptEntries.forEach(entry => {
      const entryUrl = resolveUrl(host, entry);
      loadScriptEntry(
        entryUrl,
        entryUrl === mainJsUrl && scriptId,
        handleLoad,
        handleError,
      );
    });
    styleEntries.forEach(entry => {
      const entryUrl = resolveUrl(host, entry);
      loadStyleEntry(entryUrl, handleLoad);
    });
  });

const lazyLoadMicroFrontend = ({
  host,
  microFrontendName,
  path,
}: {
  host: string;
  microFrontendName: string;
  path: string;
}) =>
  lazy(async () => {
    setMicroFrontendInfo(microFrontendName, host);
    const scriptId = generateScriptId(microFrontendName);
    if (!document.getElementById(scriptId)) {
      const manifest = await fetchManifest(host);
      await loadEntryPoints(manifest, host, scriptId);
    }
    const Component: FC<{ history: History }> = ({ history }) => (
      <MicroFrontend
        history={history}
        host={host}
        name={microFrontendName}
        path={path}
      />
    );
    return { default: Component };
  });

export default lazyLoadMicroFrontend;

interface Manifest {
  files: {
    'main.js': string;
    'main.js.map': string;
    'index.html': string;
    [name: string]: string;
  };
  entrypoints: string[];
}
