import styled from "styled-components";

const Component = styled.div`
width: 350px ;
height: 880px ;
margin-left: 50px;
margin-top: 30px;
span{
    width: 10px;
    height: 10px; 
    border-radius: 50%; 
} 
.circle-andamento{
    background-color: var(--andamento);
}
.circle-finalizado{
    background-color:var(--finalizado);
}
.circle-aberto{
    background-color:var(--aberto);
}
.text-wrapper{
    display: flex;
    align-items: center;
    gap: 10px;
} 
 p{
    display: flex;
    margin-left: 32px;
} 
.box{
    position: sticky;
    top: 0;
    z-index:3;
}
.chat-aberto{
    background-color: var(--aberto) ;
   
}
.chat-andamento{
    background-color: var(--andamento);
}
.chat-finalizado{
    background-color: var(--finalizado);
}
 .box{
    width: 350px;
    height: 35px;
    border-radius: 6px 6px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.box h3{
    color: #FFF;
}
.divider{
    background-color: #FFF;
    border-bottom: 1px solid #D9D9D9;
    height: 50px;
    
} 
.divider :hover{
    background-color: #D9D9D9;
}
.text-wrapper{
    margin-top: 5px;
    margin-left: 10px;
    
} 
.component :hover{
    background-color: #D9D9D9;
    cursor: pointer;
} 
.chats{
    overflow-y:scroll;
    overflow-x: hidden;
    max-height: 25vh;
    margin-bottom: 5px;
}
`
export default Component