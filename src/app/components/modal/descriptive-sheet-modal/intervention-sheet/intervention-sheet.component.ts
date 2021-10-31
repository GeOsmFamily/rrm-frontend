import { DescriptiveSheet } from './../../../../interfaces/DescriptiveSheet';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-intervention-sheet',
  templateUrl: './intervention-sheet.component.html',
  styleUrls: ['./intervention-sheet.component.scss'],
})
export class InterventionSheetComponent {
  @Input() descriptiveModel: DescriptiveSheet | undefined;
  constructor() {}
}
