import { DescriptiveSheet } from './../../../../interfaces/DescriptiveSheet';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alerte-sheet',
  templateUrl: './alerte-sheet.component.html',
  styleUrls: ['./alerte-sheet.component.scss'],
})
export class AlerteSheetComponent {
  @Input() descriptiveModel: DescriptiveSheet | undefined;

  constructor() {}
}
