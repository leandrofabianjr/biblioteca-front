import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'app/services/alert.service';
import { Author } from '../../models/author';
import { AuthorsService } from '../../services/authors.service';

@Component({
  selector: 'app-authors-new',
  templateUrl: './authors-new.component.html',
  styleUrls: ['./authors-new.component.sass'],
})
export class AuthorsNewComponent implements OnInit {
  authorForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private autSrv: AuthorsService,
    public dialogRef: MatDialogRef<AuthorsNewComponent>,
    private alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public author: Author
  ) {}

  ngOnInit() {
    this.authorForm = this.fb.group({
      name: [this.author?.name ?? '', Validators.required],
    });
  }

  save() {
    if (this.authorForm?.valid) {
      this.loading = true;

      const author = new Author();
      author.uuid = this.author?.uuid;
      author.ownerUuid = this.author?.ownerUuid;
      author.name = this.authorForm.get('name')?.value;

      this.autSrv.save(author).subscribe({
        next: (aut) => {
          this.alert.success('Autor criado com sucesso');
          this.dialogRef.close(aut);
        },
        error: (err) => {
          console.error('Erro ao salvar autor', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.alert.error(`Não foi possível salvar. ${msg}`);
          this.loading = false;
        },
      });
    }
  }
}
