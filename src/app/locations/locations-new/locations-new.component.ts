import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationsService } from '../../services/locations.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Location } from '../../models/location';
import { AlertService } from 'app/services/alert.service';

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
    private alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public location: Location
  ) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      description: [this.location?.description ?? '', Validators.required],
    });
  }

  save() {
    if (this.locationForm?.valid) {
      this.loading = true;

      const location = new Location();
      location.uuid = this.location?.uuid;
      location.ownerUuid = this.location?.ownerUuid;
      location.description = this.locationForm.get('description')?.value;

      this.locSrv.save(location).subscribe({
        next: (loc) => {
          this.alert.success('Local criado com sucesso');
          this.dialogRef.close(loc);
        },
        error: (err) => {
          console.error('Erro ao salvar local', err);
          const msg = err?.error?.message ?? err?.error?.message;
          this.alert.error(`Não foi possível salvar. ${msg}`);
          this.loading = false;
        },
      });
    }
  }
}
