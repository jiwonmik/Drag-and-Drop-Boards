import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { boardState } from "./atom";
import Trash from "./components/Trash";
import DraggableBoard from "./components/DraggableBoard";

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
  height: 500px;
  // 수정필요: 위 board들이 보이지 않음
  overflow: auto;
`

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

  const onDragEnd = (info:DropResult) => {
    const {source, destination} = info;
    if (!destination) return;
    
    if (destination?.droppableId === source.droppableId){
      // same board movement.
      setBoards((allBoards) => {
        const boardIndex = allBoards.findIndex((board)=> board.id === +source.droppableId);
        const itemsCopy = [...allBoards[boardIndex].items];
        const item = itemsCopy.splice(source.index, 1)
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
        
        //  edit localStorage value board
        localStorage.setItem("boards", JSON.stringify(newBoards));
        return newBoards;
      })
    }
  }
  const {register, setValue, handleSubmit} = useForm<IForm>();
  // Add new board
  const onAddBoard = (data:IForm) => {
    setBoards((allBoards)=>{
      const newBoards = [
        ...allBoards,
        {
          id: Date.now(),
          boardName: data.boardName,
          items: []
        }
      ]
      setValue("boardName", "");
      //  edit localStorage value board
      localStorage.setItem("boards", JSON.stringify(newBoards));
      return newBoards;
    })
  }

  return (
    <>
    <DragDropContext onDragEnd={onDragEnd}>
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
        <Droppable 
          droppableId="boards" 
          direction="horizontal"
          type="BOARDS">
          {(provided) => (
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
          </Boards>
          )}
        </Droppable>
      </BoardWrapper>
      <Trash />
    </Wrapper>
    </DragDropContext>
    </>

  );
}

export default App;
