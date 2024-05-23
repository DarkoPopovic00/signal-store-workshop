import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ProgressBarComponent } from '@/shared/ui/progress-bar.component';
import { SortOrder } from '@/shared/models/sort-order.model';
import { Album, searchAlbums, sortAlbums } from '@/albums/album.model';
import { AlbumFilterComponent } from './album-filter/album-filter.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { patchState, signalState } from '@ngrx/signals';
import { AlbumsService } from '../albums.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlbumSearchStore } from './album-search.store';

export type AlbumSearchState = {
  albums: Album[];
  showProgress: boolean;
  query: string;
  order: SortOrder;
};

const initialState: AlbumSearchState = {
  albums: [],
  showProgress: false,
  query: '',
  order: 'asc',
};
@Component({
  selector: 'ngrx-album-search',
  standalone: true,
  imports: [ProgressBarComponent, AlbumFilterComponent, AlbumListComponent],
  template: `
    <ngrx-progress-bar [showProgress]="store.isPending()" />

    <div class="container">
      <h1>Albums ({{ store.totalAlbums() }})</h1>

      <ngrx-album-filter
        [query]="store.query()"
        [order]="store.order()"
        (queryChange)="store.updateQuery($event)"
        (orderChange)="store.updateOrder($event)"
      />

      <ngrx-album-list
        [albums]="store.filteredAlbums()"
        [showSpinner]="store.showSpinner()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AlbumSearchStore]
})
export default class AlbumSearchComponent  {
  // state = signalState<AlbumSearchState>(initialState);

  readonly store = inject(AlbumSearchStore);
  // readonly snackBar = inject(MatSnackBar);

  // filteredAlbums = computed(() => {
  //   const searchedAlbums = searchAlbums(
  //     this.state.albums(),
  //     this.state.query(),
  //   );
  //   return sortAlbums(searchedAlbums, this.state.order());
  // });
  // totalAlbums = computed(() => this.filteredAlbums().length);
  // showSpinner = computed(
  //   () => this.state.showProgress() && this.state.albums().length === 0,
  // );

  // loadAllAlbums = rxMethod<void>(
  //   pipe(
  //     tap(() => patchState(this.state, {showProgress: true})),
  //     exhaustMap(() =>
  //       this.albumService
  //         .getAll()
  //         .pipe(
  //           tapResponse({
  //             next: (albums) =>  patchState(this.state, { albums, showProgress: false }),
  //             error: (err: { message: string }) => {patchState(this.state, { showProgress: false });
  //             this.snackBar.open(err.message, 'Close', { duration: 5_000 });},
  //           }),
  //         ),
  //     ),
  //   )
  // );

  // ngOnInit(): void {
  //   this.loadAllAlbums();
  // }

  // updateQuery(query: string): void {
  //   patchState(this.state, { query });
  // }

  // updateOrder(order: SortOrder): void {
  //   patchState(this.state, { order });
  // }
}
// exoprt type TodoStore = InstanceType<typeof TodoStore>();