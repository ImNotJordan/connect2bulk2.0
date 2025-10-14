import React from 'react';
type TruckType = {
    id?: string;
    truck_number?: string;
    available_date?: string;
    origin?: string;
    destination_preference?: string;
    trailer_type?: string;
    equipment?: string;
    length_ft?: number | string;
    weight_capacity?: number | string;
    comment?: string;
    created_at?: string;
    owner?: string;
    __typename?: string;
};
type Props = {
    onAddNewTruck: () => void;
    lastCreated?: TruckType | null;
    trucks: TruckType[];
    loading: boolean;
    error: string | null;
    onDeleteTruck?: (truckId: string) => Promise<void>;
};
declare const MyTrucks: React.FC<Props>;
export default MyTrucks;
