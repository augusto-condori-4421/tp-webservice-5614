// usa recipes.service.ts para buscar recetas y traducirlas
// la lógica de llamadas http está en src/app/core/services/recipes.service.ts
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipesService, Recipe } from '../../core/services/recipes.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recipes.component.html'
})
export class RecipesComponent implements OnDestroy {

  searchText: string = '';
  recipes: Recipe[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  hasSearched: boolean = false;

  // datos del modal de traducción
  selectedRecipe: Recipe | null = null;
  translation: string | null = null;
  translating: boolean = false;
  translationError: string = '';

  private modalInstance: any = null;

  constructor(
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
  ) { }

  // busca recetas por nombre al hacer click en el botón
  onSearch(): void {
    if (!this.searchText.trim()) return;

    this.loading = true;
    this.errorMsg = '';
    this.recipes = [];
    this.hasSearched = true;

    this.recipesService.searchRecipes(this.searchText).subscribe({
      next: (data) => {
        this.recipes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMsg = 'API key inválida. Verificá la clave de RapidAPI.';
        } else {
          this.errorMsg = 'Error al buscar recetas. Intentá de nuevo.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // devuelve solo el primer párrafo de la descripción, sin markdown
  getShortDescription(text: string): string {
    if (!text) return '';
    // tomo el primer párrafo (antes del primer \n\n o \n###)
    const firstParagraph = text.split(/\n\n|\n###/)[0];
    // elimino cualquier símbolo markdown restante (# al inicio de línea)
    return firstParagraph.replace(/^#+\s*/gm, '').trim();
  }

  // abre el modal y traduce la descripción de la receta seleccionada
  onTranslate(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.translation = null;
    this.translationError = '';
    this.translating = true;

    this.openModal();

    // traduzco solo el primer párrafo para no consumir caracteres innecesarios
    const textToTranslate = this.getShortDescription(recipe.description);

    this.recipesService.translateToSpanish(textToTranslate).subscribe({
      next: (translated) => {
        this.translation = translated;
        this.translating = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.translationError = 'Error al traducir. Verificá la API key de RapidAPI.';
        this.translating = false;
        this.cdr.detectChanges();
      }
    });
  }

  // abre el modal de Bootstrap reutilizando la instancia si ya existe
  private openModal(): void {
    const el = document.getElementById('translateModal');
    if (!el) return;
    this.modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(el);
    this.modalInstance.show();
  }

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }
}
