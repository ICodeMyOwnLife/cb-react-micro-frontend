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

const fetchScripts = (manifest: Manifest, host: string, scriptId: string) =>
  new Promise<void>((resolve) => {
    let count = 0;
    const mainJsUrl = resolveUrl(host, manifest.files['main.js']);
    const scriptEntries = manifest.entrypoints.filter((entry) =>
      entry.endsWith('.js'),
    );
    scriptEntries.forEach((entry) => {
      const script = document.createElement('script');
      const entryUrl = resolveUrl(host, entry);
      script.src = entryUrl;
      script.async = true;
      if (entryUrl === mainJsUrl) script.id = scriptId;
      script.onload = () => {
        count += 1;
        if (count === scriptEntries.length) resolve();
      };
      document.head.appendChild(script);
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
      await fetchScripts(manifest, host, scriptId);
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
