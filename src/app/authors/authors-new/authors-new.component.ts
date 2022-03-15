import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthorsService } from '../../services/authors.service';
import { Author } from '../../models/author';

@Component({
  selector: 'app-authors-new',
  templateUrl: './authors-new.component.html',
  styleUrls: ['./authors-new.component.sass'],
})
export class AuthorsNewComponent implements OnInit {
  authorForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autSrv: AuthorsService,
    public dialogRef: MatDialogRef<AuthorsNewComponent>,
    @Inject(MAT_DIALOG_DATA) public author: Author
  ) {}

  ngOnInit() {
    this.authorForm = this.fb.group({
      nome: [this.author ? this.author.name : '', Validators.required],
    });
  }

  salvar() {
    if (this.authorForm?.valid) {
      let author = new Author();
      author.id = this.author?.id;
      author.name = this.authorForm.get('nome')?.value;

      this.autSrv.save(author).subscribe(
        (aut) => {
          author = aut;
          this.dialogRef.close(author);
        },
        (err) => console.error('Erro ao salvar autor', err)
      );
    }
  }
}
