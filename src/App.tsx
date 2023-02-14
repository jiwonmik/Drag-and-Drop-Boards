import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import styled from "styled-components";
import { toDoState } from "./atom";
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
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 500px;
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
`
const AddBoardBtn = styled.button`
  
`;

function App() {
  const [toDos,setToDos] = useRecoilState(toDoState);
  console.log(toDos);
  useEffect(()=>{
    // get or set localStorage values
    const curStorage = JSON.parse(localStorage.getItem("toDos")!);
    if (!curStorage){
      localStorage.setItem("toDos", JSON.stringify(toDos));
    }
  })
  const onDragEnd = (info:DropResult) => {
    const {source, destination} = info;
    if (!destination) return;

    if (destination?.droppableId === source.droppableId){
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const item = boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, ...item);

        const newBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy
        }
        //  edit localStorage value index
        localStorage.setItem("toDos", JSON.stringify(newBoards));
        return newBoards
      })}
    else{
      // different board movement.
      setToDos((allBoards)=>{
        const srcBoard = [...allBoards[source.droppableId]];
        const item = srcBoard.splice(source.index, 1);

        // drag to trash
        if (destination.droppableId === "trash"){
          const newBoards = {
            ...allBoards,
            [source.droppableId]: srcBoard,
          }
          // delete localStorage value board
          localStorage.setItem("toDos", JSON.stringify(newBoards));
          return newBoards
        }

        const dstBoard = [...allBoards[destination.droppableId]];
        
        // drag to another board
        dstBoard.splice(destination.index, 0, ...item);
        const newBoards ={
          ...allBoards,
          [source.droppableId]: srcBoard,
          [destination.droppableId]: dstBoard
        }
        //  edit localStorage value board
        localStorage.setItem("toDos", JSON.stringify(newBoards));
        return newBoards
      })
    }
  }

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
    <TrashWrapper>
      <Trash />
    </TrashWrapper>

    <Wrapper>
      <AddBoardBtn>
        ADD
      </AddBoardBtn>
      <BoardWrapper>
        <Boards>
        {Object.keys(toDos).map(boardId => 
        <Board boardId={boardId} key={boardId} toDos={toDos[boardId]}/>
        )}
      </Boards>
      </BoardWrapper>
    </Wrapper>
    </DragDropContext>
    </>

  );
}

export default App;
