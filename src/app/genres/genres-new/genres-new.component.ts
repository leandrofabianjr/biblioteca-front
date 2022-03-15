import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenresService } from '../../services/genres.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Genre } from '../../models/genre';

@Component({
  selector: 'app-genres-new',
  templateUrl: './genres-new.component.html',
  styleUrls: ['./genres-new.component.scss'],
})
export class GenresNewComponent implements OnInit {
  genreForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autSrv: GenresService,
    public dialogRef: MatDialogRef<GenresNewComponent>,
    @Inject(MAT_DIALOG_DATA) public genre: Genre
  ) {}

  ngOnInit() {
    this.genreForm = this.fb.group({
      description: [
        this.genre ? this.genre.description : '',
        Validators.required,
      ],
    });
  }

  save() {
    if (this.genreForm?.valid) {
      let genre = new Genre();
      genre.id = this.genre.id;
      genre.description = this.genreForm.get('description')?.value;

      this.autSrv.save(genre).subscribe(
        (aut) => {
          genre = aut;
          this.dialogRef.close(genre);
        },
        (err) => console.error('Erro ao salvar gênero', err)
      );
    }
  }
}
