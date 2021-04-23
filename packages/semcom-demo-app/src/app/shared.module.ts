import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export const declarations = [];
export const providers = [];
export const imports = [];
export const exports = [
  CommonModule,
  TranslateModule,
];

@NgModule({
  declarations,
  providers,
  imports,
  exports,
})

export class SharedModule { }
