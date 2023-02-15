import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { boardState, IItem } from "../atom";
import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import ClearIcon from '@mui/icons-material/Clear';

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
  border-radius: 5px;
  min-height: 200px;
  background-color: ${(props) => props.theme.boardColor};
`;

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
  display: flex;
  padding: 0px 20px 0px 20px;
`
const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
`;

const BoardDelete = styled.button`  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
`;
const DeleteWrapper = styled.div`
  display: flex;
  justify-content: right;
  margin-right: 10px;
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
interface IForm {
  item: string;
}

function Board({boardId, boardName, boardIndex, items}: IBoardProps){
  const [boards, setBoards] = useRecoilState(boardState);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const onAddItem = ({item}:IForm) => {
    const newItem = {
      id: Date.now(),
      text: item
    };
    setBoards((allBoards) => {
      const targetBoard = allBoards[boardIndex];
      const newItems = [...targetBoard.items, newItem];
      const newBoard = {...targetBoard, items: newItems};
      const newBoards = [
        ...allBoards.slice(0, boardIndex),
        newBoard,
        ...allBoards.slice(boardIndex+1),
      ]
      return newBoards;
    });
    setValue("item", "");
  };
  useEffect(()=>{
    // add new item to localStorage
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);
  const onBoardDelete = () => {
    setBoards((allBoards)=>{
      const newBoards = [
        ...allBoards.slice(0,boardIndex),
        ...allBoards.slice(boardIndex+1)
      ]
      // delete board from localStorage
      localStorage.setItem("boards", JSON.stringify(newBoards));
      return newBoards;
    })
  };

  return (
    <Wrapper>
      <DeleteWrapper>
      <BoardDelete onClick={onBoardDelete}>
        <ClearIcon />
      </BoardDelete>
      </DeleteWrapper>
      <Title>{boardName}</Title>
      <Form onSubmit={handleSubmit(onAddItem)}>
        <Input
        {...register("item", {required: true})}
        type="text" placeholder= {`Add Task on ${boardName}`}/>
      </Form>
      <Droppable droppableId={boardId+""}> 
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
    </Wrapper>
  );
};

export default Board;
