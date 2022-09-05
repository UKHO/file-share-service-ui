import 'jest-preset-angular/setup-jest';
import { jest } from '@jest/globals';
window.open = jest.fn();
console.error = jest.fn();