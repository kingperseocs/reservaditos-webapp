import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ShortDatePipe } from '../../../../shared/pipes/short-date.pipe';
import { AdminReservation } from '../../models/reservation';

const SUGGESTED_REASONS = [
  'El área está en mantenimiento ese día.',
  'Hay un evento del edificio programado.',
  'El horario no está disponible.',
];

/**
 * Not in the Figma: the backend requires a reason, so the dialog follows the
 * look of «Suspender área». Closes with the reason, or undefined if cancelled.
 */
@Component({
  selector: 'app-reject-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, ShortDatePipe],
  template: `
    <header class="dialog-header">
      <h2 mat-dialog-title>Rechazar solicitud</h2>
      <button type="button" class="close" mat-dialog-close aria-label="Cerrar">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </header>

    <mat-dialog-content>
      <p class="summary">
        <strong>{{ request.resident.name }}</strong> · {{ request.area.name }} ·
        {{ request.date | shortDate }} · {{ request.slot.label }}
      </p>

      <label class="field-label" for="reject-reason">Motivo</label>
      <textarea
        id="reject-reason"
        class="reason"
        rows="3"
        maxlength="300"
        placeholder="El residente verá este motivo en la app"
        [formControl]="reason"
      ></textarea>

      <div class="suggestions" aria-label="Motivos sugeridos">
        @for (suggestion of suggestions; track suggestion) {
          <button type="button" class="suggestion" (click)="reason.setValue(suggestion)">
            {{ suggestion }}
          </button>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close type="button">Cancelar</button>
      <button
        mat-flat-button
        class="rs-button-danger"
        type="button"
        [disabled]="reason.invalid"
        (click)="confirm()"
      >
        Rechazar
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './reject-dialog.scss',
})
export class RejectDialog {
  protected readonly request = inject<AdminReservation>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<RejectDialog, string>>(MatDialogRef);

  protected readonly suggestions = SUGGESTED_REASONS;
  protected readonly reason = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });

  protected confirm(): void {
    if (this.reason.valid) this.dialogRef.close(this.reason.value.trim());
  }
}
