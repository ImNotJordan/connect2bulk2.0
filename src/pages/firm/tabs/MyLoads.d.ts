import React from 'react';
type Props = {
    loads: any[];
    onAddNewLoad: () => void;
    onDeleteLoad?: (loadId: string) => Promise<void>;
    deletingId?: string | null;
};
declare const MyLoads: React.FC<Props>;
export default MyLoads;
