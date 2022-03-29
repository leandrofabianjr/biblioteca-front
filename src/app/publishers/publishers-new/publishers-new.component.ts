import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublishersService } from '../../services/publishers.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Publisher } from '../../models/publisher';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publishers-new',
  templateUrl: './publishers-new.component.html',
  styleUrls: ['./publishers-new.component.scss'],
})
export class PublishersNewComponent implements OnInit {
  publisherForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private autSrv: PublishersService,
    public dialogRef: MatDialogRef<PublishersNewComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public publisher: Publisher
  ) {}

  ngOnInit() {
    this.publisherForm = this.fb.group({
      name: [this.publisher?.name ?? '', Validators.required],
    });
  }

  save() {
    if (this.publisherForm?.valid) {
      this.loading = true;

      const publisher = new Publisher();
      publisher.uuid = this.publisher?.uuid;
      publisher.ownerUuid = this.publisher?.ownerUuid;
      publisher.name = this.publisherForm.get('name')?.value;

      this.autSrv.save(publisher).subscribe({
        next: (aut) => this.dialogRef.close(aut),
        error: (err) => {
          console.error('Erro ao salvar editora', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.snackBar.open(`Não foi possível salvar. ${msg}`, 'Ok');
          this.loading = false;
        },
      });
    }
  }
}
