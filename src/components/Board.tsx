import { useRef } from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`
const Wrapper =styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  padding-top: 30px;
  border-radius: 5px;
  min-height: 200px;
  background-color: ${(props) => props.theme.boardColor};
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  border-radius: 5px;
  flex-grow: 1;  
  background-color: ${props => 
  props.isDraggingOver ? "#dfe6e9": 
  props.isDraggingFromThis ? "#b2bec3" : "transparent"}; 
  transition: background-color .3s ease-in-out;
  padding: 20px;
`

interface IBoardProps {
  toDos: string[];
  boardId: string;
}


function Board({toDos, boardId}: IBoardProps){
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick=()=>{
    inputRef.current?.focus();
    setTimeout(() => {
      inputRef.current?.blur();
    }, 5000)
  }
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <input ref={inputRef} placeholder="grab me"></input>
      <button onClick={onClick}>click me</button>
      <Droppable droppableId={boardId}> 
      {(provided, info) => (
        <Area 
          isDraggingFromThis={Boolean(info.draggingFromThisWith)}
          isDraggingOver={info.isDraggingOver}
          ref={provided.innerRef} 
          {...provided.droppableProps}>
          {toDos.map((toDo, index) => (
            <DraggableCard key={toDo} toDo={toDo} index={index} />
          )
          )}
          {provided.placeholder}
        </Area>
      )}
      </Droppable>
    </Wrapper>
  );
};

export default Board;