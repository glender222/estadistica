import { Component, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { createChart, IChartApi } from 'lightweight-charts';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { Usuario } from '../models/usuario';
import { CardModule } from 'primeng/card';
import { UsuariossService } from './service/usuarioss.service';
import { EstadisticasUsuario, EstadisticasGenerales } from './models/usuario-estadisticas';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule,
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule,
    SkeletonModule, DropdownModule, CardModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  private chart!: IChartApi;

  totalRecords: number = 0;
  cargando: boolean = false;
  usuarios: Usuario[] = [];
  titulo: string = '';
  opc: string = '';
  usuario = new Usuario();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  estadisticas: EstadisticasGenerales = {
    totalUsuarios: 0,
    usuariosPorPersona: new Map<string, number>()
  };

  constructor(
    private usuarioService: UsuariossService, // Cambiar a UsuariossService
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.listarUsuarios();
    this.calcularEstadisticas();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initChart();
      // Reinicializar el gráfico cuando cambie el tamaño de la ventana
      window.addEventListener('resize', () => this.initChart());
    }
  }

  listarUsuarios() {
    this.cargando = true;
    this.usuarioService.getUsuarios().subscribe({  // Corregido de usuariossService a usuarioService
      next: (data) => {
        this.usuarios = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de usuarios',
        });
      },
    });
  }

  filtrarUsuarios() {
    if (this.filtroNombre) {
      return this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.usuarios;
  }

  showDialogCreate() {
    this.titulo = 'Crear Usuario';
    this.opc = 'Agregar';
    this.op = 0;
    this.usuario = new Usuario();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Usuario';
    this.opc = 'Editar';
    this.usuarioService.getUsuarioById(id).subscribe((data) => {  // Asegurarse que este método existe
      this.usuario = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteUsuario(id: number) {
    this.isDeleteInProgress = true;
    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario eliminado',
        });
        this.isDeleteInProgress = false;
        this.listarUsuarios();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el usuario',
        });
      },
    });
  }

  addUsuario(): void {
    if (!this.usuario.nombre || this.usuario.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario registrado',
        });
        this.listarUsuarios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el usuario',
        });
      },
    });
  }

  editUsuario() {
    if (!this.usuario.nombre || this.usuario.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.usuarioService.updateUsuario(this.usuario, this.usuario.idusuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Usuario actualizado',
        });
        this.listarUsuarios();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el usuario',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addUsuario();
    } else if (this.op == 1) {
      this.editUsuario();
    }
  }

  private initChart() {
    if (!isPlatformBrowser(this.platformId) || !this.chartContainer?.nativeElement) {
      return;
    }

    try {
      if (this.chart) {
        this.chart.remove();
      }

      const container = this.chartContainer.nativeElement;

      // Asegurar que el contenedor tiene dimensiones
      if (container.clientWidth === 0) {
        console.error('Container width is 0');
        return;
      }

      this.chart = createChart(container, {
        width: container.clientWidth,
        height: 300,
        layout: {
          background: { color: '#ffffff' }, // Remove type property
          textColor: '#333',
        },
        grid: {
          vertLines: { visible: true, color: '#f0f0f0' },
          horzLines: { visible: true, color: '#f0f0f0' },
        },
        rightPriceScale: {
          visible: true,
        },
        timeScale: {
          visible: true,
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const series = this.chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      this.usuarioService.getEstadisticas().subscribe({
        next: (estadisticas) => {
          const chartData = estadisticas.map(item => ({
            time: item.time,
            value: item.cantidad,
          }));

          if (chartData.length > 0) {
            series.setData(chartData);
            this.chart.timeScale().fitContent();
          } else {
            console.warn('No hay datos para mostrar en el gráfico');
          }
        },
        error: (error) => {
          console.error('Error al cargar datos del gráfico:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el gráfico'
          });
        }
      });
    } catch (error) {
      console.error('Error al inicializar el gráfico:', error);
    }
  }

  private prepareChartData(usuarios: any[]) {
    const personaCount = new Map<string, number>();
    usuarios.forEach(usuario => {
      const personaNombre = usuario.persona?.nombre || 'Sin Persona';
      personaCount.set(personaNombre, (personaCount.get(personaNombre) || 0) + 1);
    });

    return Array.from(personaCount.entries()).map(([nombre, cantidad], index) => ({
      time: index.toString(),
      value: cantidad
    }));
  }

  calcularEstadisticas() {
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.estadisticas.totalUsuarios = usuarios.length;
        console.log('Total usuarios:', this.estadisticas.totalUsuarios);
      },
      error: (error) => {
        console.error('Error al calcular estadísticas:', error);
      }
    });
  }
}
