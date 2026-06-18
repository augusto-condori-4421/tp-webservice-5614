// usa car-brands.service.ts para traer marcas y modelos
// la lógica de llamadas http está en src/app/core/services/car-brands.service.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarBrandsService } from '../../core/services/car-brands.service';

@Component({
  selector: 'app-car-maker',
  standalone: true,
  imports: [],
  templateUrl: './car-maker.component.html'
})
export class CarMakerComponent implements OnInit, OnDestroy {

  makes: any[] = [];
  loading: boolean = true;
  errorMsg: string = '';
  selectedMake: any = null;      // marca seleccionada para el modal
  models: any[] = [];            // modelos de la marca seleccionada
  modelsLoading: boolean = false;
  modelsError: string = '';

  // caché local de modelos para no repetir peticiones por marca
  private modelsCache = new Map<number, any[]>();
  // instancia del modal para reutilizarla
  private modalInstance: any = null;

  constructor(private carBrandsService: CarBrandsService) {}

  ngOnInit(): void {
    this.loadMakes();
  }

  // cargo todas las marcas al iniciar el componente
  loadMakes(): void {
    this.carBrandsService.getMakes().subscribe({
      next: (data) => {
        this.makes = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMsg = 'API key inválida o sin suscripción al servicio de autos.';
        } else {
          this.errorMsg = 'Error al cargar las marcas. Verificá la API key.';
        }
        this.loading = false;
      }
    });
  }

  // al hacer click en una marca, cargo sus modelos y abro el modal
  onMakeClick(make: any): void {
    this.selectedMake = make;
    this.modelsError = '';
    this.models = [];

    // si los modelos ya están en caché, los uso directamente sin llamar a la api
    if (this.modelsCache.has(make.id)) {
      this.models = this.modelsCache.get(make.id)!;
      this.modelsLoading = false;
      this.openModal();
      return;
    }

    this.modelsLoading = true;
    this.openModal();

    this.carBrandsService.getModelsByMake(make.id).subscribe({
      next: (data) => {
        this.models = data;
        this.modelsCache.set(make.id, data);  // guardo en caché
        this.modelsLoading = false;
      },
      error: () => {
        this.modelsError = 'Error al cargar los modelos.';
        this.modelsLoading = false;
      }
    });
  }

  // abro el modal de Bootstrap desde el código, reutilizo la instancia si ya existe
  private openModal(): void {
    const modalEl = document.getElementById('modelsModal');
    if (!modalEl) return;

    // getOrCreateInstance evita el error de instancia duplicada de Bootstrap
    this.modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalEl);
    this.modalInstance.show();
  }

  // limpio la instancia del modal al destruir el componente
  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }
}
