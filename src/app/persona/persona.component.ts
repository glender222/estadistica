import { Component, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { createChart, IChartApi } from 'lightweight-charts';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { Persona } from '../models/persona';
import { PersonaService } from '../services/persona.service';
import { CardModule } from 'primeng/card';
import { PersonasService } from './service/personas.service';
import { EstadisticasPersonas } from './models/personas';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, FormsModule, InputTextModule, 
    DialogModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, 
    SkeletonModule, DropdownModule, CardModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  private chart!: IChartApi;

  totalRecords: number = 0;
  cargando: boolean = false;
  personas: Persona[] = [];
  titulo: string = '';
  opc: string = '';
  persona = new Persona();
  op = 0;
  visible: boolean = false;
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';

  estadisticas = {
    totalPersonas: 0,
    promedioEdad: 0,
    personasPorEstado: new Map<string, number>()
  };

  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personasService: PersonasService, // Añadir este servicio
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
    this.calcularEstadisticas();
  }

  ngAfterViewInit() {
    // Retrasa la inicialización del gráfico
    setTimeout(() => {
      this.initChart();
    }, 0);
  }

  private initChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.chartContainer && this.chartContainer.nativeElement) {
      try {
        if (this.chart) {
          this.chart.remove();
        }

        requestAnimationFrame(() => {
          this.chart = createChart(this.chartContainer.nativeElement, {
            width: this.chartContainer.nativeElement.clientWidth,
            height: 300,
            layout: {
              background: { color: '#ffffff' },
              textColor: '#333',
            },
          });

          const lineSeries = this.chart.addLineSeries();
          this.personaService.getPersonas().subscribe({
            next: (data) => {
              if (data && data.length > 0) {
                const chartData = data.map((persona, index) => ({
                  time: index.toString(),
                  value: persona.id || index
                }));
                lineSeries.setData(chartData);
              }
            },
            error: (error) => {
              console.error('Error loading chart data:', error);
            }
          });
        });
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    }
  }

  listarPersonas() {
    this.cargando = true;
    this.personaService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de personas',
        });
      },
    });
  }

  calcularEstadisticas() {
    this.personaService.getPersonas().subscribe(personas => {
      this.estadisticas.totalPersonas = personas.length;
      
      // Calcular personas por estado
      const estadosCount = new Map<string, number>();
      personas.forEach(persona => {
        const estadoNombre = persona.estado?.nombre || 'Sin Estado';
        estadosCount.set(estadoNombre, (estadosCount.get(estadoNombre) || 0) + 1);
      });
      this.estadisticas.personasPorEstado = estadosCount;

      // Actualizar el gráfico
      this.actualizarGrafico(personas);
    });
  }

  private actualizarGrafico(personas: Persona[]) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.chartContainer && this.chartContainer.nativeElement && personas.length > 0) {
      try {
        if (this.chart) {
          this.chart.remove();
        }

        this.chart = createChart(this.chartContainer.nativeElement, {
          width: this.chartContainer.nativeElement.clientWidth,
          height: 300,
          layout: {
            background: { color: '#f8f9fa' },
            textColor: '#333',
          },
          grid: {
            vertLines: { color: '#ddd', style: 1 },
            horzLines: { color: '#ddd', style: 1 },
          },
          rightPriceScale: {
            borderVisible: true,
          },
          timeScale: {
            borderVisible: true,
            timeVisible: true,
          },
        });

        const barSeries = this.chart.addBarSeries({
          thinBars: false,
          priceFormat: {
            type: 'volume',
          },
        });

        this.personasService.getEstadisticas().subscribe(estadisticas => {
          console.log('Estadísticas recibidas:', estadisticas);
          
          const chartData = estadisticas.map((item, index) => {
            // Create a date string in yyyy-mm-dd format
            const date = new Date();
            date.setDate(date.getDate() + index); // Increment date for each item
            const dateStr = date.toISOString().split('T')[0]; // Format: yyyy-mm-dd
            
            return {
              time: dateStr,
              open: item.cantidad,
              high: item.cantidad,
              low: item.cantidad,
              close: item.cantidad
            };
          });

          console.log('Datos del gráfico:', chartData);
          barSeries.setData(chartData);
          
          // Ajustar el contenido después de establecer los datos
          setTimeout(() => {
            this.chart.timeScale().fitContent();
          }, 100);
        });

      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  }

  // Agregar método para generar colores aleatorios
  private getRandomColor(): string {
    const colors = [
      '#26a69a', '#ef5350', '#ab47bc', '#7e57c2', 
      '#5c6bc0', '#42a5f5', '#29b6f6', '#26c6da'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  filtrarPersonas() {
    if (this.filtroNombre) {
      return this.personas.filter(persona => 
        persona.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.personas;
  }

  showDialogCreate() {
    this.titulo = 'Crear Persona';
    this.opc = 'Agregar';
    this.op = 0;
    this.persona = new Persona();
    this.visible = true;
  }

  showDialogEdit(id: number) {
    this.titulo = 'Editar Persona';
    this.opc = 'Editar';
    this.personaService.getPersonaById(id).subscribe((data) => {
      this.persona = data;
      this.op = 1;
      this.visible = true;
    });
  }

  deletePersona(id: number) {
    this.isDeleteInProgress = true;
    this.personaService.deletePersona(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona eliminada',
        });
        this.isDeleteInProgress = false;
        this.listarPersonas();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la persona',
        });
      },
    });
  }

  addPersona(): void {
    if (!this.persona.nombre || this.persona.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.personaService.createPersona(this.persona).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona registrada',
        });
        this.listarPersonas();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar la persona',
        });
      },
    });
  }

  editPersona() {
    if (!this.persona.nombre || this.persona.nombre.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio',
      });
      return;
    }

    this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Persona actualizada',
        });
        this.listarPersonas();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la persona',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addPersona();
    } else if (this.op == 1) {
      this.editPersona();
    }
  }
}
