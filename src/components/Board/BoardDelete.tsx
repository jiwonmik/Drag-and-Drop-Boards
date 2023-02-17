import { useSetRecoilState } from "recoil";
import { boardState } from "../../atom";
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "./DraggableBoard";

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
        <Button onClick={onBoardDelete}>
          <DeleteIcon />
        </Button>
    );
}
export default BoardDelete;