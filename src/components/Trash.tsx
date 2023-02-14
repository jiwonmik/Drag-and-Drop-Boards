import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Area = styled.div<IAreaProps>`
  border-radius: 5px;
  // background-color why not change??????
  background-color: ${props => 
  props.isDraggingOver ? "##ff7979":"transparent"}; 
  transition: background-color .3s ease-in-out;
  padding: 30px;
`;
interface IAreaProps {
    isDraggingOver: boolean;
};
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;
function Trash(){
  return (
      <>
      <Title>🗑️</Title>
      <Droppable droppableId="trash">
      {(provided, info) => (        
      <Area 
        ref={provided.innerRef} 
        isDraggingOver={info.isDraggingOver}
        {...provided.droppableProps}>
        {provided.placeholder}
      </Area>
      )}
      </Droppable>
      </>
  );
};

export default Trash;