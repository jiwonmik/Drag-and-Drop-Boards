import { useState } from "react";
import { Button } from './DraggableBoard';
import { useSetRecoilState } from 'recoil';
import { boardState } from '../../atom';
import { useForm } from "react-hook-form";
import { IForm } from "../Card/DraggableCard";
import Clear from "@mui/icons-material/Clear";
import styled from "styled-components";

interface IBoardEdit {
    index: number;
}

const Input = styled.input`
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    &:focus {
    outline: 0;
    }
`;


function BoardEdit({index}: IBoardEdit){
    const setBoards = useSetRecoilState(boardState);
    const [,setEditMode] = useState(false);
    const {register, setValue, handleSubmit} = useForm<IForm>();

    const handleEdit = () => {
        setBoards((allBoards)=>{
            const copyBoard = allBoards[index];
            const newBoard = {
                ...copyBoard,
                boardName: "edit"
            }
            return [
                ...allBoards.slice(0,index),
                newBoard,
                ...allBoards.slice(index+1)
            ];
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleEdit)}>
                <Input {...register("editText", {required: true})}
                type="text"/>
            </form>
            <Button onClick={() => setEditMode((prev)=>!prev)}>
                <Clear/>
            </Button>
        </>
    );
};

export default BoardEdit;