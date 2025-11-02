import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Pulisce il DOM dopo ogni test
afterEach(() => {
  cleanup();
});
