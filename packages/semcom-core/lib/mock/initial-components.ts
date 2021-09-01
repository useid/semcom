import { ComponentMetadata } from '../component/models/component-metadata.model';

export const initialComponents = [
  {
    uri: 'foo1/bar',
    description: 'test1',
    label: 'test1',
    tag: 'tag-001',
    author: 'test1',
    version: 'test1',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo2/bar',
    description: 'test2',
    label: 'test2',
    tag: 'tag-002',
    author: 'test2',
    version: 'test2',
    latest: true,
  } as ComponentMetadata,
  {
    uri: 'foo3/bar',
    description: 'test3',
    label: 'test3',
    tag: 'tag-003',
    author: 'test3',
    version: 'test3',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo4/bar',
    description: 'test4',
    label: 'test4',
    tag: 'tag-004',
    author: 'test4',
    version: 'test4',
    latest: true,
  } as ComponentMetadata,
] as ComponentMetadata[];
