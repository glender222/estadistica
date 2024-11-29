import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { Rol } from '../models/rol';
import { RolService } from '../services/rol.service';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  roles: Rol[] = [];
  titulo: string = '';
  opc: string = '';
  rol = new Rol();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private rolService: RolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarRoles();
  }

  listarRoles() {
    this.cargando = true;
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de roles',
        });
      },
    });
  }

  filtrarRoles() {
    if (this.filtroNombre) {
      return this.roles.filter(rol => 
        rol.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.roles;
  }

  showDialogCreate() {
    this.titulo = 'Crear Rol';
    this.opc = 'Agregar';
    this.op = 0;
    this.rol = new Rol();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Rol';
    this.opc = 'Editar';
    this.rolService.getRolById(id).subscribe((data) => {
      this.rol = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteRol(id: number) {
    this.isDeleteInProgress = true;
    this.rolService.deleteRol(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarRoles();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el rol',
        });
      },
    });
  }

  addRol(): void {
    if (!this.rol.nombre || this.rol.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.rolService.createRol(this.rol).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol registrado',
        });
        this.listarRoles();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el rol',
        });
      },
    });
  }

  editRol() {
    if (!this.rol.nombre || this.rol.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.rolService.updateRol(this.rol, this.rol.idrol).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol actualizado',
        });
        this.listarRoles();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el rol',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addRol();
    } else if (this.op == 1) {
      this.editRol();
    }
  }
}
