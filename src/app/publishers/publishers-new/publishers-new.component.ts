import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublishersService } from '../../services/publishers.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Publisher } from '../../models/publisher';

@Component({
  selector: 'app-publishers-new',
  templateUrl: './publishers-new.component.html',
  styleUrls: ['./publishers-new.component.scss'],
})
export class PublishersNewComponent implements OnInit {
  publisherForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autSrv: PublishersService,
    public dialogRef: MatDialogRef<PublishersNewComponent>,
    @Inject(MAT_DIALOG_DATA) public publisher: Publisher
  ) {}

  ngOnInit() {
    this.publisherForm = this.fb.group({
      nome: [this.publisher ? this.publisher.name : '', Validators.required],
    });
  }

  save() {
    if (this.publisherForm?.valid) {
      let publisher = new Publisher();
      publisher.id = this.publisher ? this.publisher.id : undefined;
      publisher.name = this.publisherForm.get('nome')?.value;

      this.autSrv.save(publisher).subscribe(
        (aut) => {
          publisher = aut;
          this.dialogRef.close(publisher);
        },
        (err) => console.error('Erro ao salvar editora', err)
      );
    }
  }
}
