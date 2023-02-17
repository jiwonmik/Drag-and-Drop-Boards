import { IItem } from "../../atom";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DraggableCard from "../Card/DraggableCard";
import styled from "styled-components";
import useBoards from "../../hooks/useBoards";
import BoardDelete from "./BoardDelete";
import CardCreate from "../Card/CardCreate";

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`
const Board =styled.div`
  height: 100%;
  padding: 10px 0px;
  border-radius: 5px;
  min-width: 250px;
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


function DraggableBoard({boardId, boardName, boardIndex, items}: IBoardProps){
  // update LocalStorage
  useBoards();
  return (
    <Draggable
      draggableId={boardId+""}
      key={boardId}
      index={boardIndex}>
        {(provided) => (
          <Board
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}>
          <BoardDelete 
            index={boardIndex}/>
          <Title>{boardName}</Title>
          <CardCreate 
            index={boardIndex}
            boardName={boardName}
            />
          <Droppable 
            droppableId={boardId+""} 
            > 
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
        </Board>
        )}
    </Draggable>
  );
};

export default DraggableBoard;
