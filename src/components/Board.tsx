import { useRef } from "react";
import { useSetRecoilState } from "recoil";
import { toDoState,ITodo } from "../atom";
import { useForm } from "react-hook-form";
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

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({toDos, boardId}: IBoardProps){
  const setToDos = useSetRecoilState(toDoState);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const onValid = ({toDo}:IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo
    };
    
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]]
      };
    });
    setValue("toDo", "");
  }
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input 
        {...register("toDo", {required: true})}
        type="text" placeholder= {`Add Task on ${boardId}`}/>
      </Form>
      <Droppable droppableId={boardId}> 
      {(provided, info) => (
        <Area 
          isDraggingFromThis={Boolean(info.draggingFromThisWith)}
          isDraggingOver={info.isDraggingOver}
          ref={provided.innerRef} 
          {...provided.droppableProps}>
          {toDos.map((toDo, index) => (
            <DraggableCard 
              key={toDo.id} 
              index={index} 
              toDoId={toDo.id} 
              toDoText={toDo.text}/>
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