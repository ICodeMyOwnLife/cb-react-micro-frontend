import React from 'react';
import { MicroFrontendAppProps } from './types';
declare const bootstrapMicroFrontend: (name: string, App: React.ComponentType<MicroFrontendAppProps>, callback?: VoidFunction | undefined) => void;
export default bootstrapMicroFrontend;
