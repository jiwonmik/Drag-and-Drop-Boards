import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { boardState } from "../../atom";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const Btn = styled.button`
  display: flex;
  padding: 0px;
  background-color: transparent;
  border: none;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
const CancelBtn = styled.button`
  border:none;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
  box-sizing: content-box;
  padding: 0;
`;
const Card = styled.div< {isDragging: boolean, isEditMode: boolean} >`
  display: flex;
  border: ${(props) => props.isEditMode ? "solid": "none"};
  border-width: 2px;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  margin-top: 10px;
  padding: 10px 10px;
  background-color: ${(props) => props.isDragging ? "#fdcb6e" : props.theme.cardColor};
  box-shadow: ${(props) => props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "null"};
  &:hover {
    ${Btn} {
      color: black;
      transition: 0.3s;
    };
    ${Btn} {
      color: black;
      transition: 0.3s;
    }
  };
`;
const Text = styled.div`
  flex: 1;
`;
export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  &:focus {
    outline: 0;
  }
  background-color: transparent;
`;

interface IDraggableCardProps {
  itemId: number;
  itemText: string;
  index: number;
  boardIndex: number;
}
export interface IForm {
  editText: string;
}

function DraggableCard({itemId, itemText, index, boardIndex}: IDraggableCardProps) {    
  const [editMode, setEditMode] = useState(false);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const [boards, setBoards] = useRecoilState(boardState);
  
  useEffect(()=>{
    // add new item to localStorage
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const handleEdit = ({editText}:IForm) => {
    if (!editText) {
      return;
    }
    setBoards((allBoards) => {
      const targetBoard = allBoards[boardIndex];
      const itemsCopy = targetBoard.items;
      
      const newItem = {
        ...itemsCopy[index],
        text: editText
      };
      const newItems = [
        ...itemsCopy.slice(0,index),
        newItem,
        ...itemsCopy.slice(index+1),
      ];
      const newBoard = {...targetBoard, items: newItems};
      const newBoards = [
        ...allBoards.slice(0, boardIndex),
        newBoard,
        ...allBoards.slice(boardIndex+1),
      ];
      setEditMode((prev)=>!prev);
      return newBoards;
    });
    setValue("editText", "");
  };

  return (
    <Draggable 
      key={itemId} 
      draggableId={itemId+""} 
      index={index}>
      {(provided,snapshot)=>(
      <Card 
        isDragging={snapshot.isDragging}
        isEditMode={editMode}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        >
        { editMode ? (
          <>
          <form onSubmit={handleSubmit(handleEdit)}>
          <Input {...register("editText", {required: true})}
          type="text"/>
          </form>
          <CancelBtn onClick={() => setEditMode((prev)=>!prev)}>
            <ClearIcon/>
          </CancelBtn>
          </>
        ) : (
        <>
        <Text>{itemText}</Text>
          <Btn onClick={() => setEditMode((prev)=>!prev)}>
            <EditIcon/>
          </Btn>
        </>
        )}
      </Card>
      )}
    </Draggable>
  )
}
export default React.memo(DraggableCard);
