import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { boardState } from "../../atom";
import AddBoxIcon from '@mui/icons-material/AddBox';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: none;
  color: white;
  padding: 5px;
  border-radius: 50%;
  border: none;
  & :hover {
    cursor: pointer;
    color: #E1E5EC;
  }
`;

function BoardCreate(){
    const setBoards = useSetRecoilState(boardState);

    // Add new board
    const onClick = () => {
      setBoards((allBoards)=>{
        const newBoards = [
          ...allBoards,
          {
            id: Date.now(),
            boardName: "New Board",
            items: [],
            isEditMode: false
          }
        ]
        return newBoards;
      })
    }
  
    return (
      <Button onClick={onClick}>
        <AddBoxIcon/>
      </Button>
    );
};

export default BoardCreate;