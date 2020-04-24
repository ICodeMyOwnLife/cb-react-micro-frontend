import React, { lazy, FC } from 'react';
import { History } from 'history';
import MicroFrontend from './MicroFrontend';

const generateScriptId = (name: string) => `_mfScript${name}`;

const getScriptUrl = (host: string, path: string) => `${host}${path}`;

const getManifestUrl = (host: string) => `${host}/asset-manifest.json`;

const fetchManifest = async (host: string) => {
  const res = await fetch(getManifestUrl(host));
  return res.json() as Promise<Manifest>;
};

const fetchScripts = (manifest: Manifest, host: string, scriptId: string) =>
  new Promise<void>(resolve => {
    let count = 0;
    const scriptEntries = Object.entries(
      manifest.files,
    ).filter(([entryPoint]) => entryPoint.endsWith('.js'));
    scriptEntries.forEach(([entryPoint, path]) => {
      const script = document.createElement('script');
      script.src = getScriptUrl(host, path);
      if (entryPoint === 'main.js') script.id = scriptId;
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
}: {
  host: string;
  microFrontendName: string;
}) =>
  lazy(async () => {
    const scriptId = generateScriptId(microFrontendName);
    if (!document.getElementById(scriptId)) {
      const manifest = await fetchManifest(host);
      await fetchScripts(manifest, host, scriptId);
    }
    const Component: FC<{ history: History }> = ({ history }) => (
      <MicroFrontend history={history} name={microFrontendName} />
    );
    return { default: Component };
  });

export default lazyLoadMicroFrontend;

interface Manifest {
  files: {
    'main.js': string;
    'main.js.map': string;
    'index.html': string;
    [entryPoint: string]: string;
  };
  entrypoints: string[];
}