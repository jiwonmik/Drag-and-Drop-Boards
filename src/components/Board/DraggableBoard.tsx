import { useState } from "react";
import { useSetRecoilState } from 'recoil';
import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { boardState, IItem } from "../../atom";
import CardCreate from "../Card/CardCreate";
import DraggableCard, { Input, IForm } from "../Card/DraggableCard";
import BoardDelete from "./BoardDelete";
import useBoards from "../../hooks/useBoards";

import styled from "styled-components";
import Edit from '@mui/icons-material/Edit';
import Clear from "@mui/icons-material/Clear";

const Title = styled.div`
  display: block;
  padding: 8px;
  font-weight: 600;
  font-size: 18px;
  & > h2 {
    align-items: center;
  }
`
const Board =styled.div`
  height: 100%;
  border-radius: 5px;
  min-width: 250px;
  background-color: ${(props) => props.theme.boardColor};
`;
const Area = styled.div<IAreaProps>`
  border-radius: 5px;
  flex-grow: 1;  
  background-color: ${props => 
  props.isDraggingOver ? "#dfe6e9": 
  props.isDraggingFromThis ? "#b2bec3" : "transparent"}; 
  transition: background-color .3s ease-in-out;
  padding: 10px 20px 20px 20px;
`
const BoardHead = styled.div<{ isEditMode: Boolean}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin: 20px;
  padding: 5px;
  border: ${(props) => props.isEditMode ? "2px solid": "none"};
  border-radius: 5px;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
`;
export const Button = styled.button`  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}
interface IBoardProps {
  boardId: number;
  boardName: string;
  boardIndex: number;
  items: IItem[];
}


function DraggableBoard({boardId, boardName, boardIndex, items}: IBoardProps){
  // update LocalStorage
  useBoards();

  const setBoards = useSetRecoilState(boardState);
  const [editMode, setEditMode] = useState(false);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  
  const handleEdit = ({editText} : IForm) => {
    console.log("enter");
    setBoards((allBoards)=>{
        const copyBoard = allBoards[boardIndex];
        const newBoard = {
            ...copyBoard,
            boardName: editText
        }
        setEditMode((prev)=>!prev);
        return [
            ...allBoards.slice(0,boardIndex),
            newBoard,
            ...allBoards.slice(boardIndex+1)
        ];
    });
}
  return (
    <Draggable
      draggableId={boardId+""}
      key={boardId}
      index={boardIndex}>
        {(provided) => (
          <Board
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <BoardHead isEditMode={editMode}>
            { editMode ? (
                <>
                <form onSubmit={handleSubmit(handleEdit)}>
                    <Input {...register("editText", {required: true})}
                    type="text"/>
                </form>
                <Button onClick={() => setEditMode((prev)=>!prev)}>
                    <Clear/>
                </Button>
            </>
            ) : (
                <>
                <Title>
                  <h2>{boardName}</h2>
                </Title>
                <Buttons>
                  <Button onClick={() => setEditMode((prev)=>!prev)}>
                    <Edit/>
                  </Button>
                  <BoardDelete index={boardIndex}/>
                </Buttons>
                </>
              )}
          </BoardHead>
          <CardCreate 
            index={boardIndex}
            boardName={boardName}
            />
          <Droppable 
            droppableId={boardId+""} 
            > 
            {(provided, info) => (
              <Area 
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                isDraggingOver={info.isDraggingOver}
                ref={provided.innerRef} 
                {...provided.droppableProps}>
                {items.map((item, index) => (
                  <DraggableCard
                    boardIndex={boardIndex} 
                    key={item.id} 
                    index={index} 
                    itemId={item.id} 
                    itemText={item.text}
                    />
                )
                )}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Board>
        )}
    </Draggable>
  );
};

export default DraggableBoard;
