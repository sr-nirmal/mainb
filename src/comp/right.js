// import React, { Component } from 'react';
// import './right.css';
// import Upload from '../comp/upload';


// class Right extends Component{
//     constructor(){
//         super();
//         this.state={
//             upload : 0, 
//             /* 1 for upload window*/
//         }
//     }
    

//     to_upload(){
//         console.log("Upload Frame")
//         this.setState({
//             upload : 1
//         });
//     }
//     to_init(){
//         console.log("Back")
//         this.setState({
//             upload : 0 
//         });
//     }
    
//     render(){
//         return(
//                 <div>
//                     <div className='upload_frame2'>
//                         {this.state.upload===1 && (
//                         <Upload >
//                             <h1>Hello</h1>
//                             <button onClick={() => this.to_init()} className='back_btn'> Back </button>
//                         </Upload>)}
//                         {this.state.upload===0 && (
//                         <h2>hello init</h2>)}
//                     </div>
//                     {/* {<div classname='upload_frame2' >}      */}
//                 {/* {this.state.upload===1 && (<iframe  src="../comp/upload.js"  >Hello</iframe>)}                        */}
                    
                    

                    
//                     <div className='right'>
//                         <h1>hello right</h1>
//                         {/* {<button onClick={() => this.to_init()} className='upload_btn'> Upload </button>} */}
                        

//                         <button onClick={() => this.to_upload()} className='upload_btn'> Upload </button>
//                         <button onClick={() => this.to_init()} className='back_btn'> Home </button>
//                         <button onClick={() => this.to_bills()} className='to_bill'> Recipts </button>
//                         <button onClick ={null} className='rec_btn'> View Bills </button>
                        
                        

//                         {/* */}
//                     </div>
                
//                 </div>
//             );
//     }
// }

// export default Right;
