import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { boardState } from "../../atom";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: white;
  width: 100px;
  border-radius: 50%;
  border: none;
  & :hover {
    cursor: pointer;
    color: #E1E5EC;
  };
  & > svg {
  font-size: 40px;
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
        <LibraryAddIcon/>
      </Button>
    );
};

export default BoardCreate;