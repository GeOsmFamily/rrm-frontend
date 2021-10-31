import { DescriptiveSheet } from './../../../../interfaces/DescriptiveSheet';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pimpdm-sheet',
  templateUrl: './pimpdm-sheet.component.html',
  styleUrls: ['./pimpdm-sheet.component.scss'],
})
export class PimpdmSheetComponent {
  @Input() descriptiveModel: DescriptiveSheet | undefined;

  constructor() {}
}
