import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { DayFirstDateAdapter } from '../../../../core/dates/day-first-date-adapter';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SuspensionImpact } from '../../models/area';
import { SuspendAreaDialog, SuspendAreaDialogData } from './suspend-area-dialog';

describe('SuspendAreaDialog', () => {
  let fixture: ComponentFixture<SuspendAreaDialog>;
  let element: HTMLElement;
  const close = vi.fn();
  const preview = vi.fn((): ReturnType<SuspendAreaDialogData['preview']> =>
    of<SuspensionImpact>({ paidCount: 3, refundAmount: 450, unpaidCount: 1 }),
  );

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await TestBed.configureTestingModule({
      imports: [SuspendAreaDialog],
      providers: [
        provideZonelessChangeDetection(),
        provideNativeDateAdapter(),
        { provide: DateAdapter, useClass: DayFirstDateAdapter },
        { provide: MatDialogRef, useValue: { close } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            area: {
              id: 'grill',
              name: 'Parrilla',
              icon: 'flame',
              fee: 50,
              deposit: 100,
              status: 'ACTIVE',
              suspensions: [],
            },
            preview,
          } satisfies SuspendAreaDialogData,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SuspendAreaDialog);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.useRealTimers());

  interface DialogInternals {
    form: SuspendAreaDialog['form'];
  }
  const form = () => (fixture.componentInstance as unknown as DialogInternals).form;
  const submitButton = () =>
    [...element.querySelectorAll('button')].find((b) => b.textContent?.includes('Suspender área'))!;

  const fill = async (reason: string, from: Date, to: Date) => {
    form().setValue({ reason, from, to });
    await vi.advanceTimersByTimeAsync(300);
    await fixture.whenStable();
  };

  it('uses the area name in the title', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Suspender Parrilla');
  });

  it('keeps «Suspender área» disabled until the form is valid', async () => {
    expect(submitButton().disabled).toBe(true);

    await fill('Mantenimiento programado', new Date(2099, 10, 20), new Date(2099, 10, 22));

    expect(submitButton().disabled).toBe(false);
  });

  it('warns how many paid bookings will be refunded for the chosen dates', async () => {
    await fill('Mantenimiento programado', new Date(2099, 10, 20), new Date(2099, 10, 22));

    expect(preview).toHaveBeenCalledWith('2099-11-20', '2099-11-22');
    const warning = element.querySelector('.warning')?.textContent ?? '';
    expect(warning).toContain('Hay 3 reservas pagadas en estas fechas');
    expect(warning).toContain('Se devuelve el 100 % a cada residente.');
    expect(warning).toContain('1 solicitud sin pagar se rechazará.');
  });

  it('rejects a range that ends before it starts', async () => {
    await fill('Mantenimiento', new Date(2099, 10, 22), new Date(2099, 10, 20));

    expect(element.textContent).toContain('no puede ser anterior');
    expect(submitButton().disabled).toBe(true);
    expect(preview).not.toHaveBeenCalled();
  });

  it('closes with the request in the backend format', async () => {
    await fill('  Mantenimiento programado ', new Date(2099, 10, 20), new Date(2099, 10, 22));

    submitButton().click();

    expect(close).toHaveBeenCalledWith({
      reason: 'Mantenimiento programado',
      from: '2099-11-20',
      to: '2099-11-22',
    });
  });
});
