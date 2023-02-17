import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { boardState } from "../atom";

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
  

function BoardCreate(){
    const setBoards = useSetRecoilState(boardState);
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
      <Form onSubmit={handleSubmit(onAddBoard)}>
        <Input
        {...register("boardName", {required: true})}
        type="text" placeholder= {`Name your new Board.`}/>
        <AddBoardBtn >
        ADD
        </AddBoardBtn>
      </Form>
    );
};

export default BoardCreate;