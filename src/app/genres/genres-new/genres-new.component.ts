import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenresService } from '../../services/genres.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Genre } from '../../models/genre';
import { AlertService } from 'app/services/alert.service';

@Component({
  selector: 'app-genres-new',
  templateUrl: './genres-new.component.html',
  styleUrls: ['./genres-new.component.scss'],
})
export class GenresNewComponent implements OnInit {
  genreForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private gnrSrv: GenresService,
    public dialogRef: MatDialogRef<GenresNewComponent>,
    private alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public genre: Genre
  ) {}

  ngOnInit() {
    this.genreForm = this.fb.group({
      description: [this.genre?.description ?? '', Validators.required],
    });
  }

  save() {
    if (this.genreForm?.valid) {
      this.loading = true;

      let genre = new Genre();
      genre.uuid = this.genre?.uuid;
      genre.ownerUuid = this.genre?.ownerUuid;
      genre.description = this.genreForm.get('description')?.value;

      this.gnrSrv.save(genre).subscribe({
        next: (gnr) => {
          this.alert.success('Gênero criado com sucesso');
          this.dialogRef.close(gnr);
        },
        error: (err) => {
          console.error('Erro ao salvar gênero', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.alert.error(`Não foi possível salvar. ${msg}`);
          this.loading = false;
        },
      });
    }
  }
}
