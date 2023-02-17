import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { boardState } from "../atom";
import styled from "styled-components";

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
  display: flex;
  padding: 0px 20px 0px 20px;
`
const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
`;

interface ICardCreateProps {
    index: number;
    boardName: string;
}
interface IForm {
    item: string;
}

function CardCreate ({index, boardName}: ICardCreateProps) {   
  const setBoards = useSetRecoilState(boardState);
  const {register, setValue, handleSubmit} = useForm<IForm>();
  
  const onAddItem = ({item}:IForm) => {
    const newItem = {
      id: Date.now(),
      text: item
    };
    setBoards((allBoards) => {
      const targetBoard = allBoards[index];
      const newItems = [...targetBoard.items, newItem];
      const newBoard = {...targetBoard, items: newItems};
      const newBoards = [
        ...allBoards.slice(0, index),
        newBoard,
        ...allBoards.slice(index+1),
      ]
      return newBoards;
    });
    setValue("item", "");
  };

   return (
    <Form onSubmit={handleSubmit(onAddItem)}>
      <Input
      {...register("item", {required: true})}
      type="text" placeholder= {`Add Task on ${boardName}`}/>
    </Form>
   );
}

export default CardCreate;