import { ComponentType } from 'react';
import { MicroFrontendAppProps } from './types';
declare const bootstrapMicroFrontend: (microFrontendName: string, App: ComponentType<MicroFrontendAppProps>, callback?: VoidFunction | undefined, rootId?: string) => void;
export default bootstrapMicroFrontend;
