import { useParams, useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function EditPost(){
    const {authFetch} = useAuth();
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const {id} = useParams();
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
        useEffect(()=>{

        async function load() {
        try{
            const post = await authFetch(`/api/forum/${id}`)
            //console.log(post)
            setPostContent(post.content);
            setPostTitle(post.title)
        }   
        catch(e){
                console.error(e);

        }

    }
    load();
    },[authFetch, id])

    function handleSubmit(e){
        setStatus("saving");

        e.preventDefault();
        (async()=> {
            try{
            const result = await authFetch(`/api/forum/${id}`,{
                method:"PUT",
                body: JSON.stringify({title:postTitle,content:postContent}), 
            },)
            console.log(result)
            navigate(`/forum/${result.id}`,{
                replace:true,
                state: {
                    success: "Post updated sucessfuly"},
            },)

        }
            catch(err){
                console.log("This is the error",err);
                setStatus('error')
                setError(err.message||'post update failed')
            }
            finally{
                if(status==='saving') setStatus('idle');
            }
            
        
        })();


    }
    return <main>
        <form onSubmit={handleSubmit}> 
    <label>
        Title
        <input type="text"
        value={postTitle}
        onChange={(e)=>setPostTitle(e.target.value)}
        />
    </label>
    <label>
    content
    <textarea 
    value={postContent}
    onChange={(e)=>setPostContent(e.target.value)}
    />
    </label>
    <button type="submit"> Save</button>

        </form>
    </main>
}