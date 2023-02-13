import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`

function App() {
  const [toDos,setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info:DropResult) => {
    console.log(info);
    const {draggableId, source, destination} = info;
    if (!destination) return;
    if (destination?.droppableId == source.droppableId){
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, draggableId);
        return {
          ...allBoards, 
          [source.droppableId]: boardCopy};
      })
    }
    else{
      // different board movement.
      setToDos((allBoards)=>{
        const srcBoard = [...allBoards[source.droppableId]];
        const dstBoard = [...allBoards[destination.droppableId]];
        srcBoard.splice(source.index, 1);
        dstBoard.splice(destination.index, 0, draggableId);
        return{
          ...allBoards,
          [source.droppableId]: srcBoard,
          [destination.droppableId]: dstBoard
        }
      })
    }
  }
  return <DragDropContext onDragEnd={onDragEnd}>
    <Wrapper>
      <Boards>
        {Object.keys(toDos).map(boardId => 
        <Board boardId={boardId} key={boardId} toDos={toDos[boardId]}/>
        )}
      </Boards>
    </Wrapper>
  </DragDropContext>;
}

export default App;
