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
import { Privilegios } from '../models/privilegios';
import { PrivilegiosService } from '../services/privilegios.service';

@Component({
  selector: 'app-privilegios',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './privilegios.component.html',
  styleUrls: ['./privilegios.component.css']
})
export class PrivilegiosComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  privilegios: Privilegios[] = [];
  titulo: string = '';
  opc: string = '';
  privilegio = new Privilegios();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  constructor(
    private privilegiosService: PrivilegiosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarPrivilegios();
  }

  listarPrivilegios() {
    this.cargando = true;
    this.privilegiosService.getPrivilegios().subscribe({
      next: (data) => {
        this.privilegios = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de privilegios',
        });
      },
    });
  }

  filtrarPrivilegios() {
    if (this.filtroNombre) {
      return this.privilegios.filter(privilegio => 
        privilegio.tipos.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.privilegios;
  }

  showDialogCreate() {
    this.titulo = 'Crear Privilegio';
    this.opc = 'Agregar';
    this.op = 0;
    this.privilegio = new Privilegios();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Privilegio';
    this.opc = 'Editar';
    this.privilegiosService.getPrivilegioById(id).subscribe((data) => {
      this.privilegio = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deletePrivilegio(id: number) {
    this.isDeleteInProgress = true;
    this.privilegiosService.deletePrivilegio(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Privilegio eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarPrivilegios();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el privilegio',
        });
      },
    });
  }

  addPrivilegio(): void {
    if (!this.privilegio.tipos || this.privilegio.tipos.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El tipo es obligatorio',
      });
      return;
    }

    this.privilegiosService.createPrivilegio(this.privilegio).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Privilegio registrado',
        });
        this.listarPrivilegios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el privilegio',
        });
      },
    });
  }

  editPrivilegio() {
    if (!this.privilegio.tipos || this.privilegio.tipos.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El tipo es obligatorio',
      });
      return;
    }

    this.privilegiosService.updatePrivilegio(this.privilegio, this.privilegio.idprivilegios).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Privilegio actualizado',
        });
        this.listarPrivilegios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el privilegio',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addPrivilegio();
    } else if (this.op == 1) {
      this.editPrivilegio();
    }
  }
}
