import { atom } from "recoil";

export interface ITodo {
    id: number;
    text: string;
}

interface IToDoState {
    [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        ToDo: [{id:1,text:"read a book"}],
        Doing: [],
        Done:[],
        Trash:[],
    }
});