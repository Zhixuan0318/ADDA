import { initializeApp } from 'firebase/app';
import { Database, get, getDatabase, ref, update } from 'firebase/database';

import config from '@/config/firebase.json';

export default class Firebase {
    database: Database;

    isAuth = false;
    needAuth: boolean;

    constructor(needAuth: boolean) {
        this.needAuth = needAuth;

        const app = initializeApp(config);
        this.database = getDatabase(app);
    }

    private async auth() {
        if (!this.needAuth) return;
    }

    async loadParcel(parcelId: string): Promise<Parcel> {
        if (!this.isAuth) await this.auth();
        const snapshot = await get(ref(this.database, `/parcel/${parcelId}`));
        if (!snapshot.val()) throw new Error('No parcel');
        return snapshot.val();
    }

    // ! Needs optimizations for large amount of users
    async loadParcels(
        address: `0x${string}` | string,
        side: 'sent' | 'received'
    ): Promise<Parcel[]> {
        if (!this.isAuth) await this.auth();
        const arraySnapshot = await get(ref(this.database, `/users/${address}/${side}`));
        const parcelIds = !arraySnapshot.val() ? [] : Object.values(arraySnapshot.val());

        const snapshot = await get(ref(this.database, '/parcel'));
        return !snapshot.val()
            ? []
            : (Object.values(snapshot.val()) as Parcel[]).filter((item) =>
                  parcelIds.includes(item.id)
              );
    }

    async updateParcel(parcel: Parcel) {
        if (!this.isAuth) await this.auth();
        await update(ref(this.database, `/parcel/${parcel.id}`), parcel);
    }

    async updateParcelField(query: string, updateObject: any) {
        if (!this.isAuth) await this.auth();
        const updates: any = {};
        updates[`/parcel/${query}`] = updateObject;
        await update(ref(this.database), updates);
    }

    async addParcelId(
        address: `0x${string}` | string,
        parcelId: string,
        side: 'sent' | 'received'
    ) {
        if (!this.isAuth) await this.auth();

        const updates: any = {};
        updates[`/users/${address}/${side}/${parcelId}`] = parcelId;

        await update(ref(this.database), updates);
    }
}
