//import 'jest-preset-angular/setup-jest.mjs';
import crypto from 'crypto';
import { webcrypto } from 'node:crypto';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone/index.mjs';

setupZoneTestEnv();


Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
      display: 'none',
      appearance: ['-webkit-appearance']
    })
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
      enumerable: true,
      configurable: true
    })
});


Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: (arr: any) => crypto.randomUUID()
  }
});

//Rhz : replaced by webcrypto below, remove later
//Object.defineProperty(globalThis, 'crypto', {
//  value: {
//    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
//  }
//});

if (!(globalThis as any).crypto || !(globalThis as any).crypto.subtle) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true
  });
}
