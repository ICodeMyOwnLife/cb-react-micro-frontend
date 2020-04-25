import React, { lazy, FC } from 'react';
import { History } from 'history';
import MicroFrontend from './MicroFrontend';
import { setMicroFrontendName } from './microFrontendLoader';

const generateScriptId = (name: string) => `_mfScript${name}`;

const resolveUrl = (host: string, path: string) =>
  new URL(path, host).toString();

const fetchManifest = async (host: string) => {
  const res = await fetch(resolveUrl(host, '/asset-manifest.json'));
  return res.json() as Promise<Manifest>;
};

const fetchScripts = (manifest: Manifest, host: string, scriptId: string) =>
  new Promise<void>(resolve => {
    let count = 0;
    manifest.entrypoints.forEach(entryPoint => {
      const script = document.createElement('script');
      script.src = resolveUrl(host, entryPoint);
      if (entryPoint === manifest.files['main.js']) script.id = scriptId;
      script.onload = () => {
        count += 1;
        if (count === manifest.entrypoints.length) resolve();
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
    setMicroFrontendName(microFrontendName);
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
    [name: string]: string;
  };
  entrypoints: string[];
}
