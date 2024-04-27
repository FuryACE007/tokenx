import { createContext } from 'react';
import { Umi } from '@metaplex-foundation/umi';

// Create a context for the Umi instance
export const UmiContext = createContext<{ umi: Umi | null }>({ umi: null });
