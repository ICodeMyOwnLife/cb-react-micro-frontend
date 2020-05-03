export declare const getMicroFrontendInfo: () => MicroFrontendInfo | undefined;
export declare const isLoadedAsMicroFrontend: (name: string) => boolean;
export declare const removeMicroFrontendInfo: (name?: string | undefined) => void;
export declare const setMicroFrontendInfo: (name: string, host: string) => void;
interface MicroFrontendInfo {
    host: string;
    name: string;
}
export {};
