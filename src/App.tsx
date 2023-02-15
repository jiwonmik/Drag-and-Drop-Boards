import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { boardState } from "./atom";
import Board from "./components/Board";
import Trash from "./components/Trash";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const BoardWrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 20px 0px 0px 0px;
  justify-content: center;
  align-items: center;
  height: 500px;
  // 수정필요: 위 board들이 보이지 않음
  overflow: auto;
`
const TrashWrapper = styled.div`
    padding: 10px 0px;
    padding-top: 20px;
    width: 100%;
    background-color: ${(props) => props.theme.boardColor};
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;
const Form = styled.form`
  display: flex;
`;
const AddBoardBtn = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  margin: 0px 0px 0px 10px;
`;
const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
`;
interface IForm {
  boardName: string;
}

function App() {
  const [boards,setBoards] = useRecoilState(boardState);
  console.log("first", boards);
  const onDragEnd = (info:DropResult) => {
    const {source, destination} = info;
    if (!destination) return;

    if (destination?.droppableId === source.droppableId){
      // same board movement.
      setBoards((allBoards) => {
        const boardCopy = allBoards[source.index];
        console.log(boardCopy);
        return allBoards;
        // const boardCopy = [...allBoards[source.droppableId]];
        // const item = boardCopy.splice(source.index, 1);
        // boardCopy.splice(destination.index, 0, ...item);

        // const newBoards = {
        //   ...allBoards,
        //   [source.droppableId]: boardCopy
        // }
        // //  edit localStorage value index
        // localStorage.setItem("toDos", JSON.stringify(newBoards));
        // return newBoards
      })}
    // else{
    //   // different board movement.
    //   setBoards((allBoards)=>{
    //     const srcBoard = [...allBoards[source.droppableId]];
    //     const item = srcBoard.splice(source.index, 1);

    //     // drag to trash
    //     if (destination.droppableId === "trash"){
    //       const newBoards = {
    //         ...allBoards,
    //         [source.droppableId]: srcBoard,
    //       };
    //       // delete localStorage value board
    //       localStorage.setItem("toDos", JSON.stringify(newBoards));
    //       return newBoards;
    //     };

    //     const dstBoard = [...allBoards[destination.droppableId]];
        
    //     // drag to another board
    //     dstBoard.splice(destination.index, 0, ...item);
    //     const newBoards ={
    //       ...allBoards,
    //       [source.droppableId]: srcBoard,
    //       [destination.droppableId]: dstBoard
    //     }
    //     //  edit localStorage value board
    //     localStorage.setItem("toDos", JSON.stringify(newBoards));
    //     return newBoards
    //   })
    // }
  }
  const {register, setValue, handleSubmit} = useForm<IForm>();
  // Add new board
  const onAddBoard = (data:IForm) => {
    setBoards((allBoards)=>{
      const newBoards = {
        ...allBoards,
        [data.boardName]: [],
      }
      //  edit localStorage value board
      localStorage.setItem("boards", JSON.stringify(newBoards));
      return newBoards;
    })
  }

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
    <TrashWrapper>
      <Trash />
    </TrashWrapper>

    <Wrapper>
      <Form onSubmit={handleSubmit(onAddBoard)}>
        <Input
        {...register("boardName", {required: true})}
        type="text" placeholder= {`Name your new Board.`}/>
        <AddBoardBtn >
        ADD
        </AddBoardBtn>
      </Form>
      <BoardWrapper>
        <Boards>
        {boards.map((board, index) => 
        <Board 
          boardId={board.id}
          index={index}
          key={board.id} 
          boardName={board.boardName}
          items={board.items}
          />
        )}
      </Boards>
      </BoardWrapper>
    </Wrapper>
    </DragDropContext>
    </>

  );
}

export default App;
