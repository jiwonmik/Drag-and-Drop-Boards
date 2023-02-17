import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardState } from "./atom";
import DraggableBoard from "./components/Board/DraggableBoard";
import BoardCreate from "./components/Board/BoardCreate";
import Trash from "./components/Trash";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const BoardWrapper = styled.div`
  display: flex;
  max-width: 980px;
  width: 100%;
  margin: 20px 0px 0px 0px;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: auto;
`
const Boards = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [boards,setBoards] = useRecoilState(boardState);

  const onDragEnd = (info:DropResult) => {
    const { type, source, destination } = info;
    console.log(info);
    if (!destination) return;

    // Board movement
    if ( type === "BOARDS") {
      // console.log(info);
      setBoards((allBoards) => {
        const newBoards = [...allBoards];
        const board = newBoards.splice(source.index, 1);
        newBoards.splice(destination.index, 0, ...board);
        return newBoards;
      })
    }
    // Card movement    
    else {
      if (destination?.droppableId === source.droppableId){
        // same board movement.
        setBoards((allBoards) => {
          const boardIndex = allBoards.findIndex((board)=> board.id === +source.droppableId);
          const itemsCopy = [...allBoards[boardIndex].items];
          const item = itemsCopy.splice(source.index, 1);
          itemsCopy.splice(destination.index, 0, ...item);
          const newBoard = { 
            ...allBoards[boardIndex], 
            items: itemsCopy
          };
          const newBoards = [
            ...allBoards.slice(0, boardIndex),
            newBoard,
            ...allBoards.slice(boardIndex+1),
          ];
          return newBoards;
        })}
      else{
        // different board movement.
        setBoards((allBoards)=>{
          const srcBoardIndex = allBoards.findIndex((board)=> board.id === +source.droppableId);
          const srcItemsCopy = [...allBoards[srcBoardIndex].items];
          const item = srcItemsCopy.splice(source.index, 1);
          const newSrcBoard = {
            ...allBoards[srcBoardIndex],
            items: srcItemsCopy
          }
          let newBoards = [
            ...allBoards.slice(0, srcBoardIndex),
            newSrcBoard,
            ...allBoards.slice(srcBoardIndex+1),
          ];

          const dstBoardIndex = allBoards.findIndex((board)=> board.id === +destination.droppableId);

          // drag to trash
          if (destination.droppableId === "trash") {
            // delete localStorage value board
            localStorage.setItem("boards", JSON.stringify(newBoards));
            return newBoards;
          }

          // drag to another board
          const dstItemsCopy = [...allBoards[dstBoardIndex].items];
          dstItemsCopy.splice(destination.index, 0, ...item);
          const newDstBoard ={
            ...allBoards[dstBoardIndex],
            items: dstItemsCopy
          }
          newBoards =[
            ...newBoards.slice(0, dstBoardIndex),
            newDstBoard,
            ...newBoards.slice(dstBoardIndex+1),
          ];          
          return newBoards;
        })
      } 
    }
  }

  return (
    <Wrapper>
    <BoardCreate />
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable 
        droppableId="boards" 
        direction="horizontal"
        type="BOARDS">
        {(provided) => (
          <BoardWrapper>
            <Boards
            ref={provided.innerRef}
            {...provided.droppableProps}>
            {boards.map((board, index) => 
            <DraggableBoard 
              boardId={board.id}
              boardIndex={index}
              key={board.id} 
              boardName={board.boardName}
              items={board.items}
              />
            )}
            {provided.placeholder}
            </Boards>
          </BoardWrapper>
        )}
      </Droppable>
      <Trash/>
    </DragDropContext>
    </Wrapper>
  );
}

export default App;
