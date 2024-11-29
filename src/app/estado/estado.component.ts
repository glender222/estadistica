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
import { Estado } from '../models/estado';
import { EstadoService } from '../services/estado.service';

@Component({
  selector: 'app-estado',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './estado.component.html',
  styleUrls: ['./estado.component.css']
})
export class EstadoComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  estados: Estado[] = [];
  titulo: string = '';
  opc: string = '';
  estado = new Estado();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';
  sidebarVisible: boolean = true;

  constructor(
    private estadoService: EstadoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.listarEstados();
  }

  listarEstados() {
    this.cargando = true;
    this.estadoService.getEstados().subscribe({
      next: (data) => {
        this.estados = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de estados',
        });
      },
    });
  }

  filtrarEstados() {
    if (this.filtroNombre) {
      return this.estados.filter(estado => 
        estado.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.estados;
  }

  showDialogCreate() {
    this.titulo = 'Crear Estado';
    this.opc = 'Agregar';
    this.op = 0;
    this.estado = new Estado();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Estado';
    this.opc = 'Editar';
    this.estadoService.getEstadoById(id).subscribe((data) => {
      this.estado = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteEstado(id: number) {
    this.isDeleteInProgress = true;
    this.estadoService.deleteEstado(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estado eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarEstados();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el estado',
        });
      },
    });
  }

  addEstado(): void {
    if (!this.estado.nombre || this.estado.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.estadoService.createEstado(this.estado).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estado registrado',
        });
        this.listarEstados();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el estado',
        });
      },
    });
  }

  editEstado() {
    if (!this.estado.nombre || this.estado.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.estadoService.updateEstado(this.estado, this.estado.idestado).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Estado actualizado',
        });
        this.listarEstados();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addEstado();
    } else if (this.op == 1) {
      this.editEstado();
    }
  }
}