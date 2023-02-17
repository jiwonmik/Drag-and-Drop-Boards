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
            { id: 0, text: "Duolingo - Spanish" },
            { id: 1, text: "Read NYT" },
            { id: 2, text: "Check Gmail" }
        ]},{
            id: 1, 
            boardName: "Doing",
            items: []
        },{
            id: 2,
            boardName: "Done",
            items: [
                { id: 0, text: "Call Sister"}
            ]
        }
    ],
    effects: [localStorageEffect("trello-clone-dnd")]
});