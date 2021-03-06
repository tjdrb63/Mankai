import { Modal, SvgIcon, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Header from "../admin/layout/Header";
import imgA from '../images/sky.jpg';
import GroupCreateModal from "../layouts/GroupCreateModal";
import GroupIcon from '@mui/icons-material/Group';

import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading'


function Group(props) {

    const [groups,setGroups] = useState([]);
    const [search,setSearch] = useState("");
    const [textHandle,setTextHandle] = useState(true)
    const groupChange = useSelector(state=>state.Reducers.groupChange);
    const user = useSelector(state=>state.Reducers.user)

    const showGroup = (data) =>{
        setGroups([])
        axios.get('/api/show/group/'+data)
        .then(res=>{
            if(res.data.length<1)
                setGroups("NoData")
            else    
                setGroups(res.data)
        })
    }
    const searchBtn=()=>{
        if(search == "")
            showGroup("NULLDATA")
        else
            showGroup(search)
    }
    const onKeyPress=(e)=>{
        if(e.key=="Enter")
            if(search == "")
                showGroup("NULLDATA")
            else
                showGroup(search)
            
    }
    useEffect(()=>{
        showGroup("NULLDATA")
    },[groupChange])

    const searchHandle=(e)=>{
        setSearch(e.target.value)
    }
    const listClick=(id)=>{
        window.location.href = "group/"+id
    }
    
    return(
        <div>
            <Header/>  
            <GroupCreateModal></GroupCreateModal>
            <div className="w-full text-center">
                <p className="text-5xl mb-5">
                   그룹 검색하기
                </p>
                <div className="mb-10 my-auto">
                    <input type={"text"} onKeyPress={onKeyPress} onChange={searchHandle} placeholder="어떤 그룹을 찾으시나요?" className="bg-gray-200 px-5 border border-gray-300 w-192 h-14 rounded-l-xl"/>
                    <button onClick={searchBtn} className="h-14 px-3 border rounded-r-xl">검색하기</button>
                </div>
            </div>        
            <div className="w-full">
            {groups.length == []  &&
                <div className="w-fit mx-auto mt-48">
                    <UseAnimations size={128} animation={loading}></UseAnimations>
                </div>
            }  
            {groups == "NoData" 
                ?<div className="w-full font-bold text-3xl mt-24 text-center mx-auto">검색결과가 없습니다</div>
                :<div className="w-full flex flex-wrap">
                    {groups.map((group)=>{
                    return(
                        <div className="bg-indigo-50 h-90 w-96 mx-5 mt-5 mb-8 rounded-md" onClick={()=>listClick(group.id)} key={group.id}>
                            <div className="flex flex justify-center items-center leading-none ">
                                <img className="h-48 w-72 rounded-md shadow-2xl mt-6 -translate-y-10 hover:-translate-y-4 transition duration-700" 
                                    src={group.logoImage} alt='null' />
                            </div>
                            <div className="h-24 mx-2 px-4 text-2xl font-bold text-black">
                                {group.name}
                                <p class="text-lg tracking-tighter text-gray-600">
                                {group.onelineintro}
                                </p>
                            </div>
                            <div class="flex justify-between items-center p-1 ml-72  h-10">
                                <div class="flex">
                                <p className="text-sm text-black-400">
                                    {group.category} / <SvgIcon><GroupIcon></GroupIcon></SvgIcon>{group.length}
                                </p>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            }
        
            </div>
        </div>
    )


}export default Group
    
