import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { startOfToday, toIsoDate } from '../../../../shared/utils/local-date';
import { AdminArea, SuspendAreaRequest, SuspensionImpact } from '../../models/area';

export interface SuspendAreaDialogData {
  area: AdminArea;
  /** Asks the backend how many bookings the range would affect. */
  preview: (from: string, to: string) => Observable<SuspensionImpact>;
}

type ImpactState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; impact: SuspensionImpact }
  | { status: 'error' };

const rangeOrder = (group: AbstractControl): ValidationErrors | null => {
  const { from, to } = (group as SuspendForm).getRawValue();
  return from && to && to < from ? { rangeOrder: true } : null;
};

type SuspendForm = FormGroup<{
  reason: FormControl<string>;
  from: FormControl<Date | null>;
  to: FormControl<Date | null>;
}>;

/** «Suspender Parrilla» modal from the Figma, with a live refund warning. */
@Component({
  selector: 'app-suspend-area-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './suspend-area-dialog.html',
  styleUrl: './suspend-area-dialog.scss',
})
export class SuspendAreaDialog {
  protected readonly data = inject<SuspendAreaDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<SuspendAreaDialog, SuspendAreaRequest>>(MatDialogRef);

  protected readonly today = startOfToday();

  protected readonly form: SuspendForm = new FormGroup(
    {
      reason: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(300)],
      }),
      from: new FormControl<Date | null>(null, Validators.required),
      to: new FormControl<Date | null>(null, Validators.required),
    },
    { validators: rangeOrder },
  );

  /** Re-queries the backend whenever the date range changes. */
  protected readonly impact = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.value),
      map(({ from, to }) =>
        from && to && to >= from ? `${toIsoDate(from)}|${toIsoDate(to)}` : null,
      ),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((range): Observable<ImpactState> => {
        if (!range) return of({ status: 'idle' });
        const [from, to] = range.split('|');
        return concat(
          of<ImpactState>({ status: 'loading' }),
          this.data.preview(from, to).pipe(
            map((impact): ImpactState => ({ status: 'ready', impact })),
            catchError(() => of<ImpactState>({ status: 'error' })),
          ),
        );
      }),
    ),
    { initialValue: { status: 'idle' } as ImpactState },
  );

  protected unpaidText(count: number): string {
    return count === 1
      ? '1 solicitud sin pagar se rechazará.'
      : `${count} solicitudes sin pagar se rechazarán.`;
  }

  protected confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { reason, from, to } = this.form.getRawValue();
    this.dialogRef.close({ reason: reason.trim(), from: toIsoDate(from!), to: toIsoDate(to!) });
  }
}
