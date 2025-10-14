import React from 'react';
type Props = {
    loads: any[];
    onAddNewLoad: () => void;
    onDeleteLoad?: (loadId: string) => Promise<void>;
    deletingId?: string | null;
};
declare const AllFirmLoads: React.FC<Props>;
export default AllFirmLoads;
