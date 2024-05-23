import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { Album, searchAlbums, sortAlbums } from '../album.model';
import { toSortOrder } from '@/shared/models/sort-order.model';
import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlbumsService } from '../albums.service';
import {
  withRequestStatus,
} from '@/shared/state/request-status.feature';
import {
  withEntities,
} from '@ngrx/signals/entities';
import { withQueryParams } from '@/shared/state/route/query-params.feature';
import { AlbumStore } from '../albums.store';

export const AlbumSearchStore = signalStore(
  withQueryParams({
    query: (p) => p ?? '',
    order: toSortOrder,
  }),
  withEntities<Album>(),
  withRequestStatus(),
  withComputed(({query, order}, albumStore = inject(AlbumStore)) => {
    const filteredAlbums = computed(() => {
      const searchedAlbums = searchAlbums(albumStore.entities(), query());
      return sortAlbums(searchedAlbums, order());
    });

    return {
      filteredAlbums,
      totalAlbums: computed(() => filteredAlbums().length),
      showSpinner: computed(
        () => albumStore.isPending() && albumStore.entities().length === 0,
      ),
    };
  }),
  withHooks({
    onInit: ({ }, albumStore = inject(AlbumStore)) => {
        albumStore.loadAllAlbums();
        albumStore.notifyOnError(albumStore.error);
    },
  }),
);
