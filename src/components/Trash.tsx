import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import {FcEmptyTrash,FcFullTrash} from "react-icons/fc";


interface IAreaProps {
  isDraggingOver: boolean;
};

const Area = styled.div<IAreaProps>`
  & > .full {
    position: absolute;
    display: ${props=> props.isDraggingOver ? "block" : "none" };
  }

`;

const TrashWrapper = styled.div`
  display: flex;
  justify-content: right;
`;

function Trash(){
  return (
    <TrashWrapper>
    <Droppable droppableId="trash">
    {(provided, info) => ( 
    <Area
      ref={provided.innerRef}
      isDraggingOver={info.isDraggingOver}
      {...provided.droppableProps}>
      <FcFullTrash size="80" className="full"/>
      <FcEmptyTrash size="80" className="empty"/>
    </Area>
    )}
    </Droppable>
    </TrashWrapper>
  );
};

export default Trash;