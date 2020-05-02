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

const loadScripts = (manifest: Manifest, host: string, scriptId: string) =>
  new Promise<void>((resolve, reject) => {
    let count = 0;
    const mainJsUrl = resolveUrl(host, manifest.files['main.js']);
    const scriptEntries = manifest.entrypoints.filter(entry =>
      entry.endsWith('.js'),
    );
    scriptEntries.forEach(entry => {
      const entryUrl = resolveUrl(host, entry);
      const script = document.createElement('script');
      script.src = entryUrl;
      script.async = true;
      if (entryUrl === mainJsUrl) script.id = scriptId;
      script.onload = () => {
        count += 1;
        if (count === scriptEntries.length) resolve();
      };
      script.onerror = (_e, _src, _lineNo, _colNo, err) => reject(err);
      document.head.appendChild(script);
    });
  });

const loadStyles = (manifest: Manifest, host: string) => {
  const styleEntries = manifest.entrypoints.filter(entry =>
    entry.endsWith('.css'),
  );

  styleEntries.forEach(entry => {
    const entryUrl = resolveUrl(host, entry);
    const link = document.createElement('link');
    link.href = entryUrl;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
  });
};

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
      await loadScripts(manifest, host, scriptId);
      loadStyles(manifest, host);
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
