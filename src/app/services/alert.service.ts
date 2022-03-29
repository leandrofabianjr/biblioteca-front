import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(`✔️ ${message}.`, 'Ok', {
      duration: 3000,
    });
  }

  error(message: string) {
    this.snackBar.open(`❌ ${message}`, 'Ok');
  }
}
