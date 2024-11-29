import { Routes } from '@angular/router';
import { EstadoComponent } from './estado/estado.component';
import { PersonaComponent } from './persona/persona.component';
import { RolComponent } from './rol/rol.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { PrivilegiosComponent } from './privilegios/privilegios.component';
import { UsuarioRolComponent } from './usuario-rol/usuario-rol.component';
import { RolPrivilegiosComponent } from './rol-privilegios/rol-privilegios.component';
import { NavegarComponent } from './navegar/navegar.component';

export const routes: Routes = [
    {
        path: 'navegar',
        component: NavegarComponent,
        children: [
          { path: 'usuario', component: UsuarioComponent },
          { path: 'rol', component: RolComponent },
          { path: 'privilegios', component: PrivilegiosComponent },
          { path: 'usuario-rol', component: UsuarioRolComponent},
          { path: 'rol-privilegios', component: RolPrivilegiosComponent},
          { path: 'estado', component: EstadoComponent },
          { path: 'persona', component: PersonaComponent },
        ],
      },
      { path: '**', redirectTo: 'navegar' }, 
];
