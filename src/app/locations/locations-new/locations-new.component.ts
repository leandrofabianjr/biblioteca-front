import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationsService } from '../../services/locations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../models/location';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-locations-new',
  templateUrl: './locations-new.component.html',
  styleUrls: ['./locations-new.component.scss'],
})
export class LocationsNewComponent implements OnInit {
  locationForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private locSrv: LocationsService,
    public dialogRef: MatDialogRef<LocationsNewComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public location: Location
  ) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      description: [
        this.location ? this.location.description : '',
        Validators.required,
      ],
    });
  }

  save() {
    if (this.locationForm?.valid) {
      this.loading = true;
      let location = new Location();
      location.uuid = this.location?.uuid;
      location.description = this.locationForm.get('description')?.value;
      console.log(location);
      this.locSrv.save(location).subscribe({
        next: (loc) => this.dialogRef.close(loc),
        error: (err) => {
          console.error('Erro ao salvar local', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.snackBar.open(`Não foi possível salvar. ${msg}`, 'Ok');
          this.loading = false;
        },
      });
    }
  }
}
