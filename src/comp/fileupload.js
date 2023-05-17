import React, { useState } from 'react';
function Fileupload(){
    const[file,setFile]=useState()

    function handleFile(event){
        setFile(event.target.files[0])
        console.log(event.target.files[0])
    }
    function handleUpload(){
         const formData = new FormData()
         formData.append('file',file)
         fetch(
            'url',{
                method:"POST",
                body:formData
            }
         ).then((response) => response.json())
         .then((result)=>
            { console.log('sucess',result)
            }
         )
         .catch(error=>{
            console.error("Error:",error)
         })
    }
    return(
       <div>
         <form onSubmit={handleUpload} >
              <input type="file" name="file" onChange={handleFile} />

           </form>
       </div>
          
          
    )
}
export default Fileupload