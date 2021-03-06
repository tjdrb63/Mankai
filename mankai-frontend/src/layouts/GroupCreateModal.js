import { Button, Divider, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageIcon from '@mui/icons-material/Image';

function GroupCreateModal(props) {

    const [open,setOpen] = useState(false);
    const [preview,setPreview] = useState("")
    const [imageFile,setImageFile] = useState("");
    const [inputText,setInputText] = useState("");
    const [inputPass,setInputPass] = useState("");
    const [optionSelected,setOptionSelected] = useState("");
    const [onelineIntro, setonelineIntro] = useState("");
    const user = useSelector(state=>state.Reducers.user);

    const options = ["IT","자유","공부","정치","투자","취업"];

    const dispatch = useDispatch()
    
    const ImageHandle =(e) =>{
        setPreview(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0])

        console.log(preview)
        // setPreview(e.target.value)
    }
    const textHandle = (e) =>{
        setInputText(e.target.value)
    }
    const onelineHandle = (e) => {
        setonelineIntro(e.target.value)
    }
    const passHandle = (e) =>{
        setInputPass(e.target.value)
    }
    const ModalOpen =() =>{
        setOpen(true)
    }
    const ModalClose = () =>{
        setOpen(false)
    }
    const save =() =>{
        const formData = new FormData();
        formData.append('img', imageFile);
        formData.append('text', inputText);
        formData.append('category',optionSelected);
        formData.append('user_id',user.id);
        formData.append('password',inputPass);
        formData.append('oneline', onelineIntro);
                
        axios.post('/api/post/group',formData
        ).then(res=>{
            ModalClose()
            window.location.href = 'group/'+res.data;
            dispatch({type:"GROUP_LIST"})
        })
    }

    const onelineValidation = () => {
        let check = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+.{1,80}$/; 
        if( onelineIntro.length >= 5 ){
            return false;
        } else {
            return !(check.test(onelineIntro));
        }
    }


    return(
        <div>
            <button onClick={ModalOpen}>그룹 만들기</button>
            <Modal 
                open={open}
                onClose={ModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="bg-white w-192 mx-auto mt-10 h-4/5 rounded-xl p-5 relative">
                    <p className="text-2xl mb-5 font-bold text-center">
                        그룹 만들기
                    </p>
                    
                    <div className="relative mt-5">
                        {preview.length > 1
                            ?    <img className="w-full h-72 rounded-xl" src={preview} alt="이미지 에러"/>
                            :    <img className="w-full h-72 rounded-xl " src="https://mankai-bucket.s3-ap-northeast-2.amazonaws.com/images/EjqTKgV5GU3U5cTOuUEGIg6303oAiz2Kfl5vS871.jpg" alt="이미지없음"/>
                        }
                        <div className="absolute w-full top-0 left-0">

                            <label
                                className="focus:outline-none flex items-center w-full h-64 justify-center hover:text-gray-300  text-white"
                                htmlFor="input-file"
                            >
                                <ImageIcon sx={{ fontSize: 70 }}></ImageIcon>
                            </label>

                            <input
                                type="file"
                                id="input-file"
                                className="hidden"
                                multiple
                                onChange={ImageHandle}
                            />




                        </div>
                    </div>
                    <div className="my-4">
                        <p className="text-xl text-gray-500 pl-5">
                            이름
                        </p>

                        <input type="text" className="bg-gray-200 rounded-xl h-10 px-4   w-full" onChange={textHandle}></input>
                        
                        <p className="">비밀번호 - 공백시 공개</p>
                        <input type="text" className="bg-gray-200 rounded-xl h-10 px-4   w-full" onChange={passHandle}></input>
                        
                    </div>
                    카테고리
                    {/* {optionSelected} */}
                    <div className="grid grid-cols-7">
                        
                        {options.map((option) => {
                            return(
                                <div>
                                    {optionSelected == option
                                        ?  <p className="bg-gray-400 rounded-lg w-20 text-center py-1">{option}</p>
                                        :  <p className="bg-gray-200 rounded-lg w-20 text-center py-1" onClick={()=>setOptionSelected(option)}>{option}</p>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <div className="absolute flex bottom-5 right-10">
                        <div className="mr-2">
                            <Button variant="outlined"  color="success" onClick={save}>만들기</Button>
                        </div>
                        <Button variant="outlined"  color="error" onClick={ModalClose}>취소하기</Button>
                
                    </div>
                </Box>
            </Modal>
        
        
        
        </div>
    )
}export default GroupCreateModal