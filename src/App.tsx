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
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 200px;
  padding: 50px 80px 0px 80px;
  & > h2 {
    font-size: 40px;
    color: white;
    font-weight: bold;
  }
  & > div {
    display: flex;
  }
`

const BoardWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0px 80px 20px 80px ;
  align-items: center;
  overflow: auto;
`
const Boards = styled.div`
  display: flex;
  flex-direction: row;
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
    <DragDropContext onDragEnd={onDragEnd}>
    <HeaderWrapper>
      <h2>My Boards</h2>
      <div>
        <BoardCreate/>
        <Trash/>
      </div>
    </HeaderWrapper>
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
              isEditMode={board.isEditMode}
              />
            )}
            {provided.placeholder}
            </Boards>
          </BoardWrapper>
        )}
      </Droppable>
    </DragDropContext>
    </Wrapper>
  );
}

export default App;
