const PUBLIC_PATH_KEY = '__webpack_public_path__';

const setPublicPath = () => {
  const win = (window as unknown) as PublicPathWindow;
  win[PUBLIC_PATH_KEY] = process.env.REACT_APP_PUBLIC_PATH;
};

export default setPublicPath;

interface PublicPathWindow {
  [PUBLIC_PATH_KEY]: string | undefined;
}
