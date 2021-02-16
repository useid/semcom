import { ComponentMetadata } from '@digita-ai/semcom-core';

export const initialComponents = [
  {
    uri: 'foo1/bar',
    label: 'test1',
    description: 'test1',
    author: 'test1',
    version: 'test1',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo2/bar',
    label: 'test2',
    description: 'test2',
    author: 'test2',
    version: 'test2',
    latest: true,
  } as ComponentMetadata,
  {
    uri: 'foo3/bar',
    label: 'test3',
    description: 'test3',
    author: 'test3',
    version: 'test3',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo4/bar',
    label: 'test4',
    description: 'test4',
    author: 'test4',
    version: 'test4',
    latest: true,
  } as ComponentMetadata,
] as ComponentMetadata[];
