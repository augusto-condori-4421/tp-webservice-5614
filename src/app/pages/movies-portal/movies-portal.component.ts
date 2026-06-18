// usa movies.service.ts para traer las películas
// la lógica de llamadas http está en src/app/core/services/movies.service.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoviesService, Movie } from '../../core/services/movies.service';

@Component({
  selector: 'app-movies-portal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './movies-portal.component.html'
})
export class MoviesPortalComponent implements OnInit {

  movies: Movie[] = [];          // lista completa de películas
  filtered: Movie[] = [];        // lista filtrada para mostrar
  loading: boolean = true;
  errorMsg: string = '';
  searchText: string = '';       // texto del input de búsqueda
  selectedGenre: string = '';    // género seleccionado en el select
  allGenres: string[] = [];      // géneros únicos para el select

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  // llamo a la api y guardo las películas en el array
  loadMovies(): void {
    this.moviesService.getTopMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filtered = data;
        // armo una lista de géneros únicos para el filtro
        const genresFlat = data.flatMap(m => m.genre ?? []);
        this.allGenres = [...new Set(genresFlat)].sort();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar las películas. Verificá la API key.';
        this.loading = false;
      }
    });
  }

  // filtra por título y por género según los controles del formulario
  applyFilters(): void {
    const text = this.searchText.toLowerCase();
    this.filtered = this.movies.filter(movie => {
      const matchTitle = movie.title.toLowerCase().includes(text);
      const matchGenre = this.selectedGenre
        ? (movie.genre ?? []).includes(this.selectedGenre)
        : true;
      return matchTitle && matchGenre;
    });
  }
}
