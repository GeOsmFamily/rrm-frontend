import { DescriptiveSheet } from './../../../../interfaces/DescriptiveSheet';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ems-sheet',
  templateUrl: './ems-sheet.component.html',
  styleUrls: ['./ems-sheet.component.scss'],
})
export class EmsSheetComponent {
  @Input() descriptiveModel: DescriptiveSheet | undefined;

  constructor() {}
}
