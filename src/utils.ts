export const generateContainerId = (name: string) => `${name}Container`;

export const joinUrlPaths = (...paths: string[]) =>
  paths
    .map(path => path.match(/\/?(.+)\/?/)?.[1] ?? '')
    .filter(Boolean)
    .join('/');
