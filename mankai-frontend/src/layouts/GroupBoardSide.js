import  React, { Component , useCallback, useEffect, useState}from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import BoardSideCard from './BoardSideCard';
import { AppBar, Avatar, Button, ClickAwayListener, Divider, Fab, Grow, IconButton, MenuItem, MenuList, Pagination, Paper, Popper, Skeleton, Slider, Stack, TextField } from '@mui/material';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Provider, useSelector, useDispatch, connect} from 'react-redux';
import { useTheme } from '@mui/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SvgIcon from '@mui/material/SvgIcon';
import CreateIcon from '@mui/icons-material/Create';
import TranslateIcon from '@mui/icons-material/Translate';
import { Slide } from 'react-toastify';
import Header from '../admin/layout/Header';
import GroupBoardSideCard from './GroupBoardSideCard';
import CloseIcon from '@mui/icons-material/Close';
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading'

const drawerWidth = 700;

function BoardSide(props){
    
    const sideData = useSelector((state=>state.Reducers.sideData));
    const user = useSelector((state=>state.Reducers.user))
    const [translatedText,setTranslatedText] = useState("");
    const [post_comment,setPostComment] = useState("");
    const [current_page,setCurrent_page] = useState(1);
    const [last_page,setLast_page] = useState(1);
    const [comments,setComments] = useState([]);
    const [paginatePage,setPaginatePage]= useState(1);
    const [updateComment,setUpdateComment] = useState("");
    const [isUpdate,setIsUpdate] =useState(0);
    const [checkComment,setCheckComment] = useState("");
    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const [transComment,setTransComment] = useState([]);
    const anchorRef = React.useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
        

    const isOpen = useSelector((state=>state.Reducers.isOpen))
    const dispatch = useDispatch()

    const handleDrawerClose = () => {
        dispatch({type:"SIDE_CLOSE"})
    };
 
    // ????????? board_id ???????????? ????????? ?????? ??????
    useEffect(()=>{
        if(sideData != null){
            setCurrent_page(current_page => 1);
            ShowComment(current_page);
            dataclean();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sideData])
    
    // current_Page??? ????????? ?????? ????????????
    useEffect(()=>{
        dataclean();
        ShowComment(current_page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[current_page])
    
    //????????? ?????????
    const dataclean = () =>{
        setTranslatedText(translatedText =>"")
        setComments(comments => [])
    }
    // ?????? ????????????
    const PostComment = () =>{
        axios.post('/api/post/groupcomment',{
            content:post_comment,
            board_id:sideData.id,
            user_id:user.id
            
        }).then(res=>{
            ShowComment(1);
            setPostComment("");
            console.log("?????? ????????????");
        })
    }
    const updateCommentHandle =(e) =>{
        setUpdateComment(updateComment => e.target.value);
    }
    //?????? ?????? ??????
    const commentHandle=(e)=>{
        setPostComment(post_comment => e.target.value);
    }
    // ????????? ????????? ??????
    const paginateHandle = (e) =>{
        setCurrent_page(current_page => e.target.outerText);
    }

    // ????????? ????????? ????????? ???????????? & ?????????????????? ??????????????? ??????
    const ShowComment = useCallback(async (page) =>{
        if(sideData){
            axios.get("/api/show/groupcomment/"+sideData.id+"?page=" + page)
            .then(res=>{ 
                setPaginatePage(paginatePage=>res.data.current_page)
                if(res.data.data.length === 0){
                    setComments(comments => ["No Data"])
                }
                else{
                    setLast_page(last_page => res.data.last_page)
                    setComments(comments => res.data.data);
                }
            })
        }
        
    })
    // ?????? ???????????? ??????
    const clickUpdate = (comment) =>{
        console.log("???????????? ??????")
        setIsUpdate(isUpdate=>comment.id);
        setCheckComment(checkComment=>comment.comment)
    }
    // ?????? ??????
    const updateCancle =()=>{
        setIsUpdate(isUpdate=>0)
    }
    // ?????? ??????
    const CommentUpdate = (comment) =>{
        console.log(comment.id)
        setTransComment(transComment=>[{
            id:0,
            text:""
        }]);
        axios.post("/api/update/groupcomment",{
            comment_id:comment.id,
            updateText:updateComment
        }).then(res=>{
            setIsUpdate(isUpdate=>0);
            ShowComment(current_page);
        })
    }
    // ?????? ?????? ?????????
    const callPapago = (data) =>{
        handleToggle()
        axios.post("/api/show/papago",{
            text:data
        }).then(res=>{
            if(res == "Error!!"){
                setTranslatedText(translatedText=>"????????? ?????? ??? ????????????");
            }
            else{
                setTranslatedText(translatedText=>res.data.message.result.translatedText);
            }
        })
    }
    // ?????? ?????? api 
    const callCommentPapago =(comment)=>{
        axios.post("/api/show/papago",{
            text:comment.comment
        }).then(res=>{
            setTransComment(transComment =>
                [{
                    id:comment.id,
                    text:res.data.message.result.translatedText,
            }])
        
        })
        console.log(transComment)
    }
    // ?????? ??????
    const clickDelete = (comment)=>{
        axios.post("/api/delete/groupcomment/"+comment.id).
        then(res=>{
            ShowComment(current_page)
            console.log("?????? ??????")
        })
    }
    // ?????? ???????????? ??????
    const handleToggle = () =>{
        setIsMenuOpen(isMenuOpen => !isMenuOpen)
    }
    return (
        <Box className="justify-between flex">
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width:drawerWidth,
                    overflowX:'hidden',
                    border: "0px"
                },
                }}
                variant="persistent"
                anchor="right"
                PaperProps={{ elevation: 4 }}
                open={isOpen}
            >
                
                
                {/* ???????????? ????????? ????????????*/}
                {sideData != null &&
                <div className='flex flex-col relative mb-20 mt-24'>
                    
                    <div className='w-full p-5'>
                    {/* ?????? & ?????? */}
                        
                        {/* ????????? ?????? */}
                        <GroupBoardSideCard board={sideData}></GroupBoardSideCard>
                        
                       
                       {/* ????????? ????????? */}
                        <div className='w-full flex justify-center my-4 rounded-xl bg-gray-200'>
                            <Pagination name="paginate" count={last_page} color="primary" onChange={paginateHandle} page={paginatePage} hidePrevButton hideNextButton />
                        </div>
                       
                        {/* ?????? ????????? ????????? */}
                        {comments.length == 0 &&
                            <div className='mx-auto w-fit'>
                                    <UseAnimations size={64} animation={loading}/>
                            </div>
                        }
                        {/* axios ???????????? ????????? */}
                        {comments[0] == "No Data" &&  
                            <div className='w-full text-center mt-10 text-sm text-gray-500'>
                                <p>????????? ????????????.</p>
                            </div>
                        }
                        {/* ?????? ???????????? */}
                        {comments[0] != "No Data" &&   
                            <div className='mb-24 '>
                                {comments.map((comment,idx)=>{
                                    return(
                                        <div className='mt-4 mb-4' key={idx}>

                                            {/* ?????? ?????? */}
                                            <div className="flex">
                                                <Avatar className='mr-3'>d</Avatar> 
                                                <div className='flex w-full justify-between'>
                                                    <div>
                                                        <h3 className="text-md font-semibold ">{comment.name}</h3>
                                                        <div className='flex text-xs text-gray-500'>
                                                            {comment.updated_at != comment.created_at &&
                                                                <p>(?????????)</p>
                                                            }
                                                            <p>{comment.updated_at}</p>
                                                        </div>
                                                    </div>
                                                    
                                                        <div className='mr-3 flex' >
                                                            <SvgIcon onClick={()=>callCommentPapago(comment)} className='mt-1 ' color="primary" component={TranslateIcon} fontSize="small"></SvgIcon>
                                                            {comment.user_id == user.id &&
                                                                <div>
                                                                    <SvgIcon onClick={()=>clickUpdate(comment)} color="warning" component={CreateIcon} fontSize="small"></SvgIcon>
                                                                    <SvgIcon onClick={()=>clickDelete(comment)} color="error" component={DeleteForeverIcon} fontSize="small"></SvgIcon>
                                                                </div>
                                                            }
                                                        </div>
                                                    
                                                </div>
                                            </div>
                                            {/* ?????? ?????? ?????? */}
                                            <div className='break-words mt-3 mb-10'>
                                                    {/* ????????? ?????? */}
                                                    {isUpdate == comment.id&&
                                                        <div>
                                                            <textarea name='updateComment' className='w-full m-2 bg-gray-200' rows={4} onChange={updateCommentHandle}
                                                            defaultValue={checkComment}></textarea>
                                                            <Button onClick={()=>CommentUpdate(comment)}>????????????</Button>
                                                            <Button onClick={updateCancle}>??????</Button>
                                                        </div>
                                                    }
                                                    {/* ????????? ????????? */}
                                                    {isUpdate != comment.id && 
                                                        <div className='mx-8'>
                                                            {comment.comment}
                                                        </div>
                                                    }
                                                    <div>
                                                    {/* ?????? ????????? ???????????? */}
                                                    {transComment[0] &&
                                                            transComment[0].id === comment.id &&
                                                            <div className='bg-gray-200 mx-8'>
                                                                {transComment[0].text}
                                                            </div>
                                                    }
                                                    </div>
                                                   
                                                    
                                            </div>
                                            <Divider light></Divider>
                                        </div>
                                    )
                                })}
                            </div>    
                        }
                    </div>
                    {/* ?????? ?????? */}
                    <div className='flex fixed w-186 mr-2 bottom-0 right-0 bg-gray-200 rounded-xl'>
                        <div className='w-full flex'>
                            <textarea name='post_comment' className='w-4/5 m-3 rounded-xl p-1 bg-gray-300' rows={3} onChange={commentHandle}
                                value={post_comment}></textarea>

                            <div className='w-1/5'>
                                <button className='bg-white px-5 mt-3 mr-3 h-20  rounded-2xl' onClick={PostComment}>?????? ??????</button>
                            </div>
                        </div>
                    </div>
                    <div className='fixed top-32 right-10 w-186'>
                        <Fab color="primary" aria-label="add" onClick={handleDrawerClose}>
                            <CloseIcon/>
                        </Fab>
                    </div>  
                </div>
            }
            </Drawer>
        </Box>
        ); 
}
export default BoardSide;
