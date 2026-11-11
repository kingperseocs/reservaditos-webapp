import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { APP_CONFIG } from '../../config/app-config.token';
import { NavBadges } from '../../state/nav-badges';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

/** Admin layout from the Figma: fixed sidebar with the building and the main sections. */
@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly badges = inject(NavBadges).counts;
  protected readonly buildingName = inject(APP_CONFIG).buildingName;

  protected readonly navItems: NavItem[] = [
    { label: 'Reservas', icon: 'event_available', path: '/reservas' },
    { label: 'Áreas', icon: 'grid_view', path: '/areas' },
    { label: 'Residentes', icon: 'group', path: '/residentes' },
  ];
}
