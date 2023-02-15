import { atom } from "recoil";

export interface IItem {
    id: number;
    text: string;
}

interface IBoard {
    id: number;
    boardName: string;
    items: IItem[]
}

// get items from localStorage
let localData = JSON.parse(localStorage.getItem("boards")!) || [];

export const boardState = atom<IBoard[]>({
    key: "board",
    default: localData,    
});