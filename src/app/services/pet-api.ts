import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetApiResponse } from '../models/pet';

@Injectable({
  providedIn: 'root'
})
export class PetApiService {
  private apiUrl = 'http://localhost:3000/api/pets';

  constructor(private http: HttpClient) {}

  lookupPet(link: string): Observable<PetApiResponse> {
    const params = new HttpParams().set('link', link);

    return this.http.get<PetApiResponse>(
      `${this.apiUrl}/lookup`,
      { params }
    );
  }
}