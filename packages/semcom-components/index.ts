import { Component } from '../semcom-core/dist/public-api';

export class ProfileComponent implements Component {

  metadata = {
    uri: 'string',
    name: 'SemCom Profile Component',
    label: 'Digita SemCom component for profile information',
    author: 'Digita',
    version: '0.2.1',
    latest: true
  }

  setData(data: any) {
    console.log(data);
  }

}
