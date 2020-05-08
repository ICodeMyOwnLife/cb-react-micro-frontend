/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
declare let __webpack_public_path__: string | undefined;

const setPublicPath = () => {
  __webpack_public_path__ = process.env.REACT_APP_PUBLIC_PATH;
};

export default setPublicPath;
