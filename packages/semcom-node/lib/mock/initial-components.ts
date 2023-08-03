import { ComponentMetadata } from '@useid/semcom-core';

/**
 * Mock data for initial components
 */
export const initialComponents = [
  {
    uri: 'foo1/bar',
    shapes: [ 'http://xmlns.com/foaf/0.1/PersonalProfileDocument' ],
    description: 'test1',
    label: 'test1',
    author: 'test1',
    tag: 'profile',
    version: '0.1.1',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo2/bar',
    shapes: [ 'http://xmlns.com/foaf/0.1/PersonalProfileDocument' ],
    description: 'test2',
    label: 'test2',
    author: 'test2',
    version: '0.1.2',
    tag: 'profile',
    latest: true,
  } as ComponentMetadata,
  {
    uri: 'foo3/bar',
    shapes: [ 'http://xmlns.com/foaf/0.1/PersonalProfileDocument' ],
    description: 'test3',
    label: 'test3',
    author: 'test3',
    tag: 'profile',
    version: '0.1.3',
    latest: false,
  } as ComponentMetadata,
  {
    uri: 'foo4/bar',
    shapes: [ 'http://xmlns.com/foaf/0.1/PersonalProfileDocument' ],
    description: 'test4',
    label: 'test4',
    author: 'test4',
    tag: 'profile',
    version: '1.1.2',
    latest: true,
  } as ComponentMetadata,
] as ComponentMetadata[];
