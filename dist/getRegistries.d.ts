declare const getRegistries: () => Map<string, MicroFrontendRegistry>;
export default getRegistries;
interface MicroFrontendRegistry {
    render: RenderMicroFrontend;
    unmount: UnmountMicroFrontend;
}
interface RenderMicroFrontend {
    (microFrontendPath: string): void;
}
interface UnmountMicroFrontend {
    (): void;
}
