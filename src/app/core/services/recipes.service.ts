// llamadas a la api de recetas (Low Carb Recipes) y traducción (Deep Translate)
// se usa en recipes.component.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// estructura real que devuelve la api para cada ingrediente
export interface RecipeIngredient {
  name: string;
  servingSize?: {
    units: string;
    desc: string;
    qty: number;
  };
}

// campos que nos interesan de cada receta
export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  ingredients: RecipeIngredient[];
  prepareTime?: number;
  cookTime?: number;
  servings?: number;
}

@Injectable({ providedIn: 'root' })
export class RecipesService {

  private searchUrl = 'https://low-carb-recipes.p.rapidapi.com/search';
  private translateUrl = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';

  constructor(private http: HttpClient) { }

  private getHeaders(host: string): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': host
    });
  }

  searchRecipes(name: string): Observable<Recipe[]> {
    const url = `${this.searchUrl}?name=${encodeURIComponent(name)}`;
    return this.http.get<Recipe[]>(url, {
      headers: this.getHeaders('low-carb-recipes.p.rapidapi.com')
    });
  }

  // traduce un texto del inglés al español usando Deep Translate
  translateToSpanish(text: string): Observable<string> {
    const body = { q: text, source: 'en', target: 'es' };
    return this.http.post<any>(this.translateUrl, body, {
      headers: this.getHeaders('deep-translate1.p.rapidapi.com').set('Content-Type', 'application/json')
    }).pipe(
      // la respuesta viene en data.translations.translatedText
      map(response => response?.data?.translations?.translatedText ?? text)
    );
  }
}
