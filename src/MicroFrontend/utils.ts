import { useEffect } from 'react';
import { History } from 'history';
import getRegistries from '../getRegistries';

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

const renderMicroFrontend = ({
  history,
  name,
}: {
  history: History;
  name: string;
}) => getRegistries().get(name)?.render(history);

const unmountMicroFrontend = ({ name }: { name: string }) =>
  getRegistries().get(name)?.unmount();

export const useMicroFrontend = ({
  history,
  host,
  name,
}: {
  history: History;
  host: string;
  name: string;
}) =>
  useEffect(() => {
    const scriptId = generateScriptId(name);
    let isCanceled = false;

    if (document.getElementById(scriptId)) {
      renderMicroFrontend({ history, name });
    } else {
      const fetchAndRender = async () => {
        const manifest = await fetchManifest(host);
        if (isCanceled) return;
        await fetchScripts(manifest, host, scriptId);
        if (isCanceled) return;
        renderMicroFrontend({ history, name });
      };

      fetchAndRender();
    }

    return () => {
      unmountMicroFrontend({ name });
      isCanceled = true;
    };
  }, [history, host, name]);

interface Manifest {
  files: {
    'main.js': string;
    'main.js.map': string;
    'index.html': string;
    [entryPoint: string]: string;
  };
  entrypoints: string[];
}
