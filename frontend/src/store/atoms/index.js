import { atom } from "recoil";


export const checkInDate = atom({
    key: "checkInDate",
    default: new Date().toISOString().split("T")[0]
});

export const checkOutDate = atom({
    key: "checkOutDate",
    default:null
});

export const selectedRooms=atom({
    key:"selectedRooms",
    default:{}
})
export const price=atom({
    key:"price",
    default:0
})
export const global_count=atom({
    key:"global_atom",
    default:0
})