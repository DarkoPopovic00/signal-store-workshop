import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@/shared/state/request-status.feature';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { Album } from './album.model';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, exhaustMap, filter } from 'rxjs';
import { AlbumsService } from './albums.service';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AlbumStore = signalStore(
  { providedIn: 'root' },
  withEntities<Album>(),
  withRequestStatus(),
  withMethods((store, albumService = inject(AlbumsService), snackBar = inject(MatSnackBar)) => ({
    loadAllAlbums: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        exhaustMap(() =>
          albumService.getAll().pipe(
            tapResponse({
              next: (albums) => {
                patchState(store, setAllEntities(albums));
                patchState(store, { ...setFulfilled() });
              },
              error: (err: { message: string }) => {
                patchState(store, setError(err.message));
              },
            }),
          ),
        ),
      ),
    ),
    notifyOnError: rxMethod<string | null>(
        pipe(
          filter(Boolean),
          tap((error) => {
            snackBar.open(error, 'Close', { duration: 5_000 });
          }),
        ),
      ),
  })),
);
