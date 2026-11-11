import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';

/** In the Figma menu but outside the test scope: shown as "Próximamente". */
@Component({
  selector: 'app-residents-coming-soon-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Residentes" />
    <app-empty-state
      icon="group"
      title="Próximamente"
      description="Aquí podrás ver a los residentes del edificio y si están al día con sus cuotas."
    />
  `,
})
export class ResidentsComingSoonPage {}
