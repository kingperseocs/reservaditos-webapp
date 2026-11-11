import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { aReservation } from '../../../../../testing/reservation.fixtures';
import { AdminReservation } from '../../models/reservation';
import { RequestsTable } from './requests-table';

describe('RequestsTable', () => {
  let fixture: ComponentFixture<RequestsTable>;
  const jorge = aReservation({
    id: 'jorge',
    resident: { id: 'jorge-diaz', name: 'Jorge Díaz', apartment: '105' },
    date: '2026-11-21',
    slot: { start: '15:00', end: '18:00', label: '15:00–18:00' },
    requestedAt: '2026-11-11T11:00:00.000Z',
    firstInLine: true,
  });
  const pedro = aReservation({
    id: 'pedro',
    resident: { id: 'pedro-gomez', name: 'Pedro Gómez', apartment: '301' },
    requestedAt: '2026-11-11T13:20:00.000Z',
  });

  const render = async (requests: AdminReservation[], busy: string[] = []) => {
    await TestBed.configureTestingModule({
      imports: [RequestsTable],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(RequestsTable);
    fixture.componentRef.setInput('requests', requests);
    fixture.componentRef.setInput('now', new Date('2026-11-11T14:00:00.000Z'));
    fixture.componentRef.setInput('busyIds', new Set(busy));
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  const rows = (el: HTMLElement) => [...el.querySelectorAll('tr.mat-mdc-row')];

  it('shows the columns of the Figma for each request', async () => {
    const el = await render([jorge, pedro]);

    const firstRow = rows(el)[0].textContent ?? '';
    expect(rows(el)).toHaveLength(2);
    expect(firstRow).toContain('JD');
    expect(firstRow).toContain('Jorge Díaz');
    expect(firstRow).toContain('105');
    expect(firstRow).toContain('Parrilla');
    expect(firstRow).toContain('Sáb 21/11');
    expect(firstRow).toContain('15:00–18:00');
    expect(firstRow).toContain('hace 3 h');
  });

  it('marks only the earliest request of a contested slot as «Pedida primero»', async () => {
    const el = await render([jorge, pedro]);

    expect(rows(el)[0].textContent).toContain('Pedida primero');
    expect(rows(el)[1].textContent).not.toContain('Pedida primero');
  });

  it('emits approve and reject with the request', async () => {
    const el = await render([jorge]);
    const approved = vi.fn();
    const rejected = vi.fn();
    fixture.componentInstance.approve.subscribe(approved);
    fixture.componentInstance.reject.subscribe(rejected);

    const [rejectButton, approveButton] = rows(el)[0].querySelectorAll('button');
    approveButton.click();
    rejectButton.click();

    expect(approved).toHaveBeenCalledWith(jorge);
    expect(rejected).toHaveBeenCalledWith(jorge);
  });

  it('disables the actions while a request is being processed', async () => {
    const el = await render([jorge], ['jorge']);

    const buttons = [...rows(el)[0].querySelectorAll('button')];
    expect(buttons.every((b) => b.disabled)).toBe(true);
  });
});
