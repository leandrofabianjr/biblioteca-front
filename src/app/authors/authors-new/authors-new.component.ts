import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Author } from '../../models/author';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
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
        next: (aut) => this.dialogRef.close(aut),
        error: (err) => {
          console.error('Erro ao salvar autor', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.snackBar.open(`Não foi possível salvar. ${msg}`, 'Ok');
          this.loading = false;
        },
      });
    }
  }
}
