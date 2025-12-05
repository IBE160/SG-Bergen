import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  rootDir: "../", // Set rootDir to SG-Bergen
  roots: [
    "<rootDir>/digital-guess-who",
    "<rootDir>"
  ],
  testMatch: [
    "<rootDir>/tests/unit/db/types.test.ts" // Temporarily focus on our test
  ],
  moduleDirectories: ["node_modules", "<rootDir>/digital-guess-who/node_modules"], // Search in both places
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/digital-guess-who/$1', // For Next.js app modules
    '^lib/(.*)$': '<rootDir>/lib/$1', // For shared lib modules
    '^zustand$': '<rootDir>/digital-guess-who/node_modules/zustand',
    '^@supabase/supabase-js$': '<rootDir>/digital-guess-who/node_modules/@supabase/supabase-js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['<rootDir>/digital-guess-who/node_modules/ts-jest', {
        tsconfig: '<rootDir>/digital-guess-who/tsconfig.json', // Specify tsconfig for ts-jest
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
