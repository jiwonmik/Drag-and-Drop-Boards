import { atom } from "recoil";

export interface IItem {
    id: number;
    text: string;
}

interface IBoard {
    id: number;
    boardName: string;
    items: IItem[];
    isEditMode: boolean;
}

const localStorageEffect = (key: string) => ({setSelf, onSet}: any) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue !== null) {
        setSelf(JSON.parse(savedValue));
    };
    onSet((newValue: IBoard[]) => {
        localStorage.setItem(key, JSON.stringify(newValue));
    });
};

export const boardState = atom<IBoard[]>({
    key: "board",
    default: [{
        id: 0,
        boardName: "To Do",
        items: [
            { id: 1, text: "Duolingo - Spanish" },
            { id: 2, text: "Read NYT" },
            { id: 3, text: "Check Gmail" }
        ],
        isEditMode: false
        },{
            id: 4, 
            boardName: "Doing",
            items: [],
            isEditMode: false
        },{
            id: 5,
            boardName: "Done",
            items: [
                { id: 6, text: "Call Sister"}
            ],
            isEditMode: false
        }
    ],
    effects: [localStorageEffect("trello-clone-dnd")]
});