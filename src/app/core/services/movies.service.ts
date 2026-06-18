// llamadas a la api de películas, se usa en movies-portal.component.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// interfaz con los campos que nos interesan de la respuesta
export interface Movie {
  title: string;
  description: string;
  image: string;
  year: string;
  genre: string[];
  rating: string;
  rank: number;
}

@Injectable({ providedIn: 'root' })
export class MoviesService {

  private apiUrl = 'https://imdb-top-100-movies.p.rapidapi.com/';

  constructor(private http: HttpClient) {}

  // trae el top 100 de películas de IMDB
  getTopMovies(): Observable<Movie[]> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
    });
    return this.http.get<Movie[]>(this.apiUrl, { headers });
  }
}
