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
import { UsuarioRol } from '../models/usuario-rol';
import { UsuarioRolService } from '../services/usuario-rol.service';

@Component({
  selector: 'app-usuario-rol',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuario-rol.component.html',
  styleUrls: ['./usuario-rol.component.css']
})
export class UsuarioRolComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  usuarioRoles: UsuarioRol[] = [];
  titulo: string = '';
  opc: string = '';
  usuarioRol = new UsuarioRol();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private usuarioRolService: UsuarioRolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarUsuarioRoles();
  }

  listarUsuarioRoles() {
    this.cargando = true;
    this.usuarioRolService.getUsuarioRoles().subscribe({
      next: (data) => {
        this.usuarioRoles = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de usuarios y roles',
        });
      },
    });
  }

  filtrarUsuarioRoles() {
    if (this.filtroNombre) {
      return this.usuarioRoles.filter(usuarioRol => 
        usuarioRol.usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.usuarioRoles;
  }

  showDialogCreate() {
    this.titulo = 'Crear Usuario y Rol';
    this.opc = 'Agregar';
    this.op = 0;
    this.usuarioRol = new UsuarioRol();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Usuario y Rol';
    this.opc = 'Editar';
    this.usuarioRolService.getUsuarioRolById(id).subscribe((data) => {
      this.usuarioRol = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteUsuarioRol(id: number) {
    this.isDeleteInProgress = true;
    this.usuarioRolService.deleteUsuarioRol(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario y rol eliminados',
        });
        this.isDeleteInProgress = false;
        this.listarUsuarioRoles();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el usuario y rol',
        });
      },
    });
  }

  addUsuarioRol(): void {
    if (!this.usuarioRol.usuario || !this.usuarioRol.rol) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El usuario y rol son obligatorios',
      });
      return;
    }

    this.usuarioRolService.createUsuarioRol(this.usuarioRol).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario y rol registrados',
        });
        this.listarUsuarioRoles();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el usuario y rol',
        });
      },
    });
  }

  editUsuarioRol() {
    if (!this.usuarioRol.usuario || !this.usuarioRol.rol) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El usuario y rol son obligatorios',
      });
      return;
    }

    this.usuarioRolService.updateUsuarioRol(this.usuarioRol, this.usuarioRol.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario y rol actualizados',
        });
        this.listarUsuarioRoles();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el usuario y rol',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addUsuarioRol();
    } else if (this.op == 1) {
      this.editUsuarioRol();
    }
  }
}
