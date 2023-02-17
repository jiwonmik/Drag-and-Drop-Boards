import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { boardState } from "../atom";

function useBoards(){
    const [boards, setBoards] = useRecoilState(boardState);

    useEffect(()=>{
        // add new item to localStorage
        localStorage.setItem("boards", JSON.stringify(boards));
    }, [boards]);
    return ;
}

export default useBoards;