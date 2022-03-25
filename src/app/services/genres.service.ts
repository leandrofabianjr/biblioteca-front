import { Injectable } from '@angular/core';
import { BaseDtoService, CollectionType, aaIDto } from './base-dto.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Genre } from '../models/genre';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface IGenreDTO extends aaIDto {
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenresService extends BaseDtoService<Genre, IGenreDTO> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, CollectionType.Genres, afAuth);
  }

  protected toDto(obj: Genre): IGenreDTO {
    return {
      id: obj.id,
      uid: obj.uid,
      description: obj.description,
    };
  }

  protected toModel(dto: IGenreDTO): Genre {
    const obj = new Genre();
    obj.id = dto.id;
    obj.uid = dto.uid;
    obj.description = dto.description;
    return obj;
  }
}
