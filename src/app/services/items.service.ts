import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { map, Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { HttpHeaders } from '@angular/common/http';
import { AuthorsService, IAuthorDTO } from './authors.service';
import { GenresService, IGenreDTO } from './genres.service';
import { IPublisherDTO, PublishersService } from './publishers.service';
import { ILocationDTO, LocationsService } from './locations.service';

export interface IWatchResponse<T> {
  loading: boolean;
  data: T;
  total: number;
}

export interface IItemsWithAggregate {
  items: IItemDTO[];
  items_aggregate: { aggregate: { totalCount: number } };
}

export interface IItemDTO {
  uuid?: string;
  description?: string;
  authors?: { author: IAuthorDTO }[];
  genres?: { genre: IGenreDTO }[];
  year?: number;
  publishers?: { publisher: IPublisherDTO }[];
  location?: ILocationDTO;
}

const QUERY = gql`
  query (
    $userId: String!
    $offset: Int
    $limit: Int
    $order_by: [items_order_by!] = { description: asc }
    $description: String = "%%"
    $authors: String = "%%"
    $genres: String = "%%"
    $publishers: String = "%%"
    $location: String = "%%"
  ) {
    items_aggregate(
      where: {
        user_id: { _eq: $userId }
        description: { _ilike: $description }
        location: { description: { _ilike: $location } }
        authors: { author: { name: { _ilike: $authors } } }
        genres: { genre: { description: { _ilike: $genres } } }
        publishers: { publisher: { name: { _ilike: $publishers } } }
      }
    ) {
      aggregate {
        totalCount: count
      }
    }
    items(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        user_id: { _eq: $userId }
        description: { _ilike: $description }
        location: { description: { _ilike: $location } }
        authors: { author: { name: { _ilike: $authors } } }
        genres: { genre: { description: { _ilike: $genres } } }
        publishers: { publisher: { name: { _ilike: $publishers } } }
      }
    ) {
      description
      authors {
        author {
          name
          uuid
        }
      }
      genres {
        genre {
          description
          uuid
        }
      }
      year
      publishers {
        publisher {
          name
          uuid
        }
      }
      location {
        description
        uuid
      }
      created_at
      uuid
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(
    private autSrv: AuthorsService,
    private gnrSrv: GenresService,
    private pubSrv: PublishersService,
    private locSrv: LocationsService,
    private apollo: Apollo
  ) {}

  fetchForTable(
    pageSize: number = 5,
    pageIndex: number = 0,
    searchTerms = {}
  ): Observable<IWatchResponse<Item[]>> {
    let variables = {
      userId: '',
      limit: pageSize,
      offset: pageIndex * pageSize,
      ...searchTerms,
    };

    console.log(variables);

    return this.apollo
      .query<IItemsWithAggregate>({
        query: QUERY,
        variables,
        context: {
          headers: new HttpHeaders({
            'x-hasura-admin-secret': '',
          }),
        },
      })
      .pipe(
        map((result) => {
          console.log(result);
          return {
            loading: result.loading,
            data: result.data.items.map((dto) => this.toModel(dto)),
            total: result.data.items_aggregate.aggregate.totalCount,
          } as IWatchResponse<Item[]>;
        })
      );
  }

  protected toDto(obj: Item): IItemDTO {
    return {
      uuid: obj.id,
      description: obj.description,
      // publishers: obj.publishers?.map<DocumentReference<DocumentData>>(
      //   (o) =>
      //     this.afs.doc(`${CollectionType.Publishers}/${o.id}`)
      //       .ref as DocumentReference<DocumentData>
      // ),
      // year: obj.year,
      // location: this.afs.doc(`${CollectionType.Locations}/${obj.location?.id}`)
      //   .ref as DocumentReference<DocumentData>,
      // authors: obj.authors?.map<DocumentReference<DocumentData>>(
      //   (o) =>
      //     this.afs.doc(`${CollectionType.Authors}/${o.id}`)
      //       .ref as DocumentReference<DocumentData>
      // ),
      // genres: obj.genres?.map<DocumentReference<DocumentData>>(
      //   (o) =>
      //     this.afs.doc(`${CollectionType.Genres}/${o.id}`)
      //       .ref as DocumentReference<DocumentData>
      // ),
    };
  }

  public toModel(dto: IItemDTO): Item {
    const obj = new Item();
    obj.id = dto.uuid;
    obj.year = dto.year;
    obj.description = dto.description;
    obj.location = this.locSrv.toModel(dto.location);
    obj.publishers = dto.publishers?.map((_dto) =>
      this.pubSrv.toModel(_dto.publisher)
    );
    obj.authors = dto.authors?.map((_dto) => this.autSrv.toModel(_dto.author));
    obj.genres = dto.genres?.map((_dto) => this.gnrSrv.toModel(_dto.genre));
    return obj;
  }
}
