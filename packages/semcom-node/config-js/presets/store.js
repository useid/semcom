import { ComponentInMemoryStore } from '../../dist/public-api.js';

const components = [
  {
    description: 'Digita SemCom component for profile information.',
    label: 'SemCom Profile Component',
    uri: 'https://components.semcom.digita.ai/components/profile.js',
    shapes: [ 'http://xmlns.com/foaf/0.1/PersonalProfileDocument' ],
    author: 'https://digita.ai',
    tag: 'profile',
    version: '0.1.0',
    latest: true,
  },
  {
    description: 'Digita SemCom component for payslip information.',
    label: 'SemCom Payslip Component',
    uri: 'https://components.semcom.digita.ai/components/payslip.js',
    shapes: [ 'http://digita.ai/voc/payslip#payslip' ],
    author: 'https://digita.ai',
    tag: 'payslip',
    version: '0.1.0',
    latest: true,
  },
];

export const defaultComponentStore = new ComponentInMemoryStore(components);
