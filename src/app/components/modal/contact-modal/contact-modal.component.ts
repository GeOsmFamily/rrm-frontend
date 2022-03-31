import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['../info-modal/info-modal.component.scss','./contact-modal.component.scss']
})
export class ContactModalComponent  {

  constructor(public dialogRef: MatDialogRef<ContactModalComponent>) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
