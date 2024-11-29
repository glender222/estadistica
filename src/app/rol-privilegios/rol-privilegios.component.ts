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
import { RolPrivilegios } from '../models/rol-privilegios';
import { RolPrivilegiosService } from '../services/rol-privilegios.service';

@Component({
  selector: 'app-rol-privilegios',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rol-privilegios.component.html',
  styleUrls: ['./rol-privilegios.component.css']
})
export class RolPrivilegiosComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  rolPrivilegios: RolPrivilegios[] = [];
  titulo: string = '';
  opc: string = '';
  rolPrivilegio = new RolPrivilegios();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private rolPrivilegiosService: RolPrivilegiosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarRolPrivilegios();
  }

  listarRolPrivilegios() {
    this.cargando = true;
    this.rolPrivilegiosService.getRolPrivilegios().subscribe({
      next: (data) => {
        this.rolPrivilegios = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de roles y privilegios',
        });
      },
    });
  }

  filtrarRolPrivilegios() {
    if (this.filtroNombre) {
      return this.rolPrivilegios.filter(rolPrivilegio => 
        rolPrivilegio.rol.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.rolPrivilegios;
  }

  showDialogCreate() {
    this.titulo = 'Crear Rol y Privilegios';
    this.opc = 'Agregar';
    this.op = 0;
    this.rolPrivilegio = new RolPrivilegios();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Rol y Privilegios';
    this.opc = 'Editar';
    this.rolPrivilegiosService.getRolPrivilegioById(id).subscribe((data) => {
      this.rolPrivilegio = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteRolPrivilegio(id: number) {
    this.isDeleteInProgress = true;
    this.rolPrivilegiosService.deleteRolPrivilegio(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol y privilegios eliminados',
        });
        this.isDeleteInProgress = false;
        this.listarRolPrivilegios();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el rol y privilegios',
        });
      },
    });
  }

  addRolPrivilegio(): void {
    if (!this.rolPrivilegio.rol || !this.rolPrivilegio.privilegios) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El rol y privilegios son obligatorios',
      });
      return;
    }

    this.rolPrivilegiosService.createRolPrivilegio(this.rolPrivilegio).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol y privilegios registrados',
        });
        this.listarRolPrivilegios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el rol y privilegios',
        });
      },
    });
  }

  editRolPrivilegio() {
    if (!this.rolPrivilegio.rol || !this.rolPrivilegio.privilegios) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El rol y privilegios son obligatorios',
      });
      return;
    }

    this.rolPrivilegiosService.updateRolPrivilegio(this.rolPrivilegio, this.rolPrivilegio.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Rol y privilegios actualizados',
        });
        this.listarRolPrivilegios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el rol y privilegios',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addRolPrivilegio();
    } else if (this.op == 1) {
      this.editRolPrivilegio();
    }
  }
}
