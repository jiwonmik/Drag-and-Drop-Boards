import { useSetRecoilState } from "recoil";
import { boardState } from "../../atom";
import styled from "styled-components";
import ClearIcon from '@mui/icons-material/Clear';

const Wrapper = styled.div`
  display: flex;
  justify-content: right;
  margin-right: 10px;
`;

const Delete = styled.button`  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
`;

interface IBoardDelete {
    index: number;
}
function BoardDelete({index}:IBoardDelete){
  const setBoards = useSetRecoilState(boardState);

  const onBoardDelete = () => {
    setBoards((allBoards)=>{
      const newBoards = [
        ...allBoards.slice(0,index),
        ...allBoards.slice(index+1)
      ]
      return newBoards;
    })
  };
    
    return (
      <Wrapper>
        <Delete onClick={onBoardDelete}>
          <ClearIcon />
        </Delete>
      </Wrapper>
    );
}
export default BoardDelete;