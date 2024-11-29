import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-navegar',
  standalone: true,
  imports: [RouterModule, SidebarModule, ButtonModule],
  templateUrl: './navegar.component.html',
  styleUrl: './navegar.component.css'
})
export class NavegarComponent {
  isCollapsed = false;
  @Input() sidebarVisible: boolean = true;
  @Input() ubicacionActual: string = '';
}
