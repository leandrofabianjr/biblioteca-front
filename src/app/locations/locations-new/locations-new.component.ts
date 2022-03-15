import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationsService } from '../../services/locations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../models/location';

@Component({
  selector: 'app-locations-new',
  templateUrl: './locations-new.component.html',
  styleUrls: ['./locations-new.component.scss'],
})
export class LocationsNewComponent implements OnInit {
  locationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autSrv: LocationsService,
    public dialogRef: MatDialogRef<LocationsNewComponent>,
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
      let location = new Location();
      location.id = this.location?.id;
      location.description = this.locationForm.get('description')?.value;

      this.autSrv.save(location).subscribe(
        (aut) => {
          location = aut;
          this.dialogRef.close(location);
        },
        (err) => console.error('Erro ao salvar location', err)
      );
    }
  }
}
