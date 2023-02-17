import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { boardState } from "../../atom";
import AddBoxIcon from '@mui/icons-material/AddBox';

const Form = styled.form`
  display: flex;
`;
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
    const onClick = () => {
      setBoards((allBoards)=>{
        const newBoards = [
          ...allBoards,
          {
            id: Date.now(),
            boardName: "Default",
            items: []
          }
        ]
        return newBoards;
      })
    }
  
    return (
      // <Form onSubmit={handleSubmit(onAddBoard)}>
      //   <Input
      //   {...register("boardName", {required: true})}
      //   type="text" placeholder= {`Name your new Board.`}/>
      //   <Button >
      //   ADD
      //   </Button>
      // </Form>
      <Button onClick={onClick}>
        <AddBoxIcon/>
      </Button>
    );
};

export default BoardCreate;