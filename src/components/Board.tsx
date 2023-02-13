import { Droppable } from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";

const Wrapper =styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  border-radius: 5px;
  min-height: 200px;
  background-color: ${(props) => props.theme.boardColor};
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`

interface IBoardProps {
  toDos: string[];
  boardId: string;
}


function Board({toDos, boardId}: IBoardProps){
    return (
      <Wrapper>
        <Title>{boardId}</Title>
        <Droppable droppableId={boardId}> 
        {(provided) => (
          <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo} toDo={toDo} index={index} />
            )
            )}
            {provided.placeholder}
          </Wrapper>
        )}
        </Droppable>
      </Wrapper>
    );
};

export default Board;