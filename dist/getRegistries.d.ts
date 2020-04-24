import { History } from 'history';
declare const getRegistries: () => Map<string, MicroFrontendRegistry>;
export default getRegistries;
interface MicroFrontendRegistry {
    render: RenderMicroFrontend;
    unmount: UnmountMicroFrontend;
}
interface RenderMicroFrontend {
    (history: History): void;
}
interface UnmountMicroFrontend {
    (): void;
}
