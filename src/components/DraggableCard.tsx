import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';

const EditBtn = styled.button`
  padding: 0px;
  background-color: transparent;
  border: none;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
const DelBtn = styled.button`
  padding: 0px;
  background-color: transparent;
  border: none;
  color: white;
  &:hover {
    cursor: pointer;
  }
`
const Card = styled.div< {isDragging: boolean} >`
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  padding:  10px 10px;
  margin-bottom: 5px;
  background-color: ${(props) => props.isDragging ? "#fdcb6e" : props.theme.cardColor};
  box-shadow: ${(props) => props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "null"};
  &:hover {
    ${EditBtn} {
      color: black;
    transition: 0.3s;
    };
    ${DelBtn} {
      color: black;
    transition: 0.3s;
    }
  };
`;

interface IDraggableCardProps {
    itemId: number;
    itemText: string;
    index: number
}

function DraggableCard({itemId, itemText, index}: IDraggableCardProps) {    
  const onEditHandle = () => {
    console.log("edit");
  };
  const onDelHandle = () => {
    console.log("delete");
  };
  return (
    <>
    <Draggable 
        key={itemId} 
        draggableId={itemId+""} 
        index={index}>
        {(provided,snapshot)=>(
        <Card 
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          >
            {itemText}
          <div>
          <EditBtn onClick={onEditHandle}>
            <EditIcon/>
          </EditBtn>
          <DelBtn onClick={onDelHandle}>
            <ClearIcon/>
          </DelBtn>
          </div>
        </Card>
        )}
      </Draggable>
      
    </>
  )
}
export default React.memo(DraggableCard);
