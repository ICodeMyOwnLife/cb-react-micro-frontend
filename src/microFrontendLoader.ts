let microFrontendName: string | null = null;

export const getMicroFrontendName = () => microFrontendName;

export const isLoadedAsMicroFrontend = (name: string) =>
  name === microFrontendName;

export const setMicroFrontendName = (name: string) => {
  microFrontendName = name;
};
