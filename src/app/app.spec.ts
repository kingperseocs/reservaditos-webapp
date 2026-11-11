import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ReservationsStore } from './features/reservations/data-access/reservations.store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => TestBed.inject(ReservationsStore).stopPolling());

  it('opens the pending requests page by default inside the admin shell', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const page = fixture.nativeElement as HTMLElement;
    expect(TestBed.inject(Router).url).toBe('/reservas');
    expect(page.querySelector('.brand-name')?.textContent).toContain('Edificio Demo');
    expect(page.querySelector('h1')?.textContent).toContain('Solicitudes por aprobar');
    expect(page.querySelectorAll('.nav-item')).toHaveLength(3);

    // The page asks the backend for the pending requests and the area list.
    const http = TestBed.inject(HttpTestingController);
    expect(http.match((r) => r.url.endsWith('/admin/reservations')).length).toBeGreaterThan(0);
    expect(http.match((r) => r.url.endsWith('/admin/areas')).length).toBe(1);
  });
});
